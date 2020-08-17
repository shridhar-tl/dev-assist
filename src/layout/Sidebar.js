import React, { PureComponent } from 'react';
import AppProfile from './AppProfile';
import { AppMenu } from './AppMenu';

class Sidebar extends PureComponent {
    render() {
        const { className } = this.props;

        return (
            <div ref={(el) => this.sidebar = el} className={className} onClick={this.onSidebarClick}>
                <div className="layout-logo">
                    Dev Assistant
                </div>
                <AppProfile />
                <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} />
            </div>
        );
    }
}

export default Sidebar;