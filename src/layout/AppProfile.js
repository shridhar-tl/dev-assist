import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';

class AppProfile extends PureComponent {

    constructor() {
        super();
        this.state = {
            expanded: false
        };
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        this.setState({ expanded: !this.state.expanded });
        event.preventDefault();
    }

    render() {
        const { displayName } = this.props;

        return (
            <div className="layout-profile">
                <div>
                    <img src="assets/layout/images/profile.png" alt="" />
                </div>
                <button className="p-link layout-profile-link" onClick={this.onClick}>
                    <span className="username">{displayName}</span>
                    <i className="pi pi-fw pi-cog" />
                </button>
                <ul className={classNames({ 'layout-profile-expanded': this.state.expanded })}>
                    <li><button className="p-link"><i className="pi pi-fw pi-user" /><span>Account</span></button></li>
                    <li><button className="p-link"><i className="pi pi-fw pi-inbox" /><span>Notifications</span><span className="menuitem-badge">2</span></button></li>
                    <li><button className="p-link"><i className="pi pi-fw pi-power-off" /><span>Logout</span></button></li>
                </ul>
            </div>
        );
    }
}

export default connect(({ user }) => user)(AppProfile);