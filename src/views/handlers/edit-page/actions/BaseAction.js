import React, { PureComponent } from 'react';
import { Panel } from 'primereact/panel';
import { actionMap } from '.';

class BaseAction extends PureComponent {
  constructor(props, title) {
    super(props);
    this.state = { collapsed: false }
    this.title = title;
  }

  static initItem(item) {
    item.hasError = true;
    return item;
  }

  toggleControl = ({ value }) => this.setState({ collapsed: value });

  removeAction = () => {
    const { index, onRemove } = this.props;

    onRemove(index);
  }

  triggerChange(item) {
    const { index, onChange } = this.props;

    if (this.hasValidationErrors(item)) {
      item.hasError = true
    }
    else {
      delete item.hasError;
    }

    onChange(item, index);
  }

  hasValidationErrors = (item) => !!this.getErrorMessages(item);

  getErrorMessages() { }

  render() {
    const { item: { id, hasError }, dragConnector } = this.props;
    const { collapsed } = this.state;
    const { title } = actionMap[id];

    const message = hasError && this.getErrorMessages();

    const header = (dragConnector(<div className="draggable-panel-title"><span className="fas fa-arrows-alt" /> {title}
      <div className="pull-right">
        {hasError && <span className="fas fa-exclamation-triangle" title={message} />}
        <span className="fas fa-trash" title="Remove this action" onClick={this.removeAction} />
      </div>
    </div>));

    return (
      <Panel className="action" header={header}
        toggleable={true} collapsed={collapsed} onToggle={this.toggleControl}>
        {this.renderAction()}
        {hasError && <div className="error-block">{message}</div>}
      </Panel>
    );
  }
}

export default BaseAction;