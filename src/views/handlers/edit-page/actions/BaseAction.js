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

  render() {
    const { item: { id }, dragConnector } = this.props;
    const { collapsed } = this.state;
    const { title } = actionMap[id];
    const header = (dragConnector(<div className="draggable-panel-title"><span className="fas fa-arrows-alt" /> {title}</div>));

    return (
      <Panel className="filter" header={header}
        toggleable={true} collapsed={collapsed} onToggle={this.toggleControl}>
        {this.renderActions()}
      </Panel>
    );
  }
}

export default BaseAction;