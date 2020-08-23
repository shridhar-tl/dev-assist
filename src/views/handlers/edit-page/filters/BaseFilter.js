import React, { PureComponent } from 'react';
import { Panel } from 'primereact/panel';
import { filterMap, filterInfo } from '.';
import { Checkbox } from '../../../../controls';

class BaseFilter extends PureComponent {
  constructor(props, title) {
    super(props);
    this.state = { collapsed: false }
    this.title = title;
  }

  static initItem(item) {
    return item;
  }

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
    const { item: { id, useOr }, index, dragConnector } = this.props;
    const { collapsed } = this.state;
    const { title } = filterMap[id];
    const infoText = filterInfo[id];

    const header = (dragConnector(<div className="draggable-panel-title">
      <span className="fas fa-arrows-alt" />
      {title}
      {index > 0 && <Checkbox checked={useOr} label="Use Or Condition" onChange={this.orClauseChanged} />}
      <div className="pull-right">
        <span className="fas fa-exclamation-triangle" />
        <span className="fas fa-trash" title="Remove this filter" onClick={this.removeFilter} />
      </div>
    </div>));

    return (
      <Panel className="filter-panel" header={header}
        toggleable={true} collapsed={collapsed} onToggle={this.toggleControl}>
        <div className="info-block">{infoText}</div>
        {this.renderFilter()}
        <div className="error-block"></div>
      </Panel>
    );
  }
}

export default BaseFilter;