import React, { PureComponent } from 'react';
import { Panel } from 'primereact/panel';
import { filterMap } from '.';

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

  render() {
    const { item: { id }, dragConnector } = this.props;
    const { collapsed } = this.state;
    const { title } = filterMap[id];
    const header = (dragConnector(<div className="draggable-panel-title"><span className="fas fa-arrows-alt" /> {title}</div>));

    return (
      <Panel className="filter" header={header}
        toggleable={true} collapsed={collapsed} onToggle={this.toggleControl}>
        {this.renderFilter()}
      </Panel>
    );
  }
}

export default BaseFilter;