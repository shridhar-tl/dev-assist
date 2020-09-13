import React, { PureComponent } from 'react';
import { Panel } from 'primereact/panel';
import { filterMap, filterInfo } from '.';
import { Checkbox } from '../../../../controls';
import { comparerMap } from '../../../../components';

class BaseFilter extends PureComponent {
  constructor(props, title) {
    super(props);
    this.state = { collapsed: false }
    this.title = title;
  }

  static initItem(item) {
    item.hasError = true;
    return item;
  }

  keyChanged = (key) => this.triggerChange({ ...this.props.item, key });

  comparerChanged = (comparer, options) => {
    let { item } = this.props;

    item = { ...item, comparer };

    const { multiValue, noInput } = options || '';

    if (noInput || ((!!multiValue) !== Array.isArray(item.value))) {
      delete item.value;
    }

    this.triggerChange(item);
  }

  validateValueWithComparerAndGetErrorMessage(value, comparer) {
    const { multiValue, noInput } = comparerMap[comparer] || '';

    if (multiValue && (!Array.isArray(value) || value.length < 2)) {
      return 'Atleast 2 values are required when using this comparer';
    }

    if (!multiValue && !noInput && !value?.trim()) {
      return 'Value is required when using the selected comparer';
    }

    return null;
  }

  valueChanged = (value) => this.triggerChange({ ...this.props.item, value });

  triggerChange(item) {
    const { index, item: oldItem, onChange } = this.props;

    if (this.hasValidationErrors(item)) {
      item.hasError = true
    }
    else {
      delete item.hasError;
    }

    onChange(item, index, oldItem);
  }

  hasValidationErrors = (item) => !!this.getErrorMessages(item);

  toggleControl = ({ value }) => this.setState({ collapsed: value });

  orClauseChanged = (useOr) => {
    const { item, index, onChange } = this.props;
    onChange({ ...item, useOr }, index);
  }

  removeFilter = () => {
    const { index, onRemove } = this.props;
    onRemove(index);
  }

  render() {
    const { item: { id, useOr, hasError }, index, dragConnector } = this.props;
    const { collapsed } = this.state;
    const { title } = filterMap[id];
    const infoText = filterInfo[id];

    const message = hasError && this.getErrorMessages();

    const header = (dragConnector(<div className="draggable-panel-title">
      <span className="fas fa-arrows-alt" />
      {title}
      {index > 0 && <Checkbox checked={useOr} label="Use Or Condition" onChange={this.orClauseChanged} />}
      <div className="pull-right">
        {hasError && <span className="fas fa-exclamation-triangle" title={message} />}
        <span className="fas fa-trash" title="Remove this filter" onClick={this.removeFilter} />
      </div>
    </div>));

    return (
      <Panel className="filter-panel" header={header}
        toggleable={true} collapsed={collapsed} onToggle={this.toggleControl}>
        <div className="info-block">{infoText}</div>
        {this.renderFilter()}
        {hasError && <div className="error-block">{message}</div>}
      </Panel>
    );
  }
}

export default BaseFilter;