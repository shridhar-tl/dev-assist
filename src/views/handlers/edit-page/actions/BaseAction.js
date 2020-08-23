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
    return item;
  }

  toggleControl = ({ value }) => this.setState({ collapsed: value });

  removeAction = () => {
    const { index, onRemove } = this.props;

    onRemove(index);
  }

  render() {
    const { item: { id }, dragConnector } = this.props;
    const { collapsed } = this.state;
    const { title } = actionMap[id];
    const header = (dragConnector(<div className="draggable-panel-title"><span className="fas fa-arrows-alt" /> {title}
      <div className="pull-right">
        <span className="fas fa-exclamation-triangle" />
        <span className="fas fa-trash" title="Remove this action" onClick={this.removeAction} />
      </div>
    </div>));

    return (
      <Panel className="action" header={header}
        toggleable={true} collapsed={collapsed} onToggle={this.toggleControl}>
        {this.renderAction()}
      </Panel>
    );
  }
}

export default BaseAction;