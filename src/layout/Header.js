import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { InputSwitch } from 'primereact/inputswitch';
import { connect } from 'react-redux';
import * as actions from '../store/actions/settings';
import { Urls } from '../common/constants';

class Header extends PureComponent {
    menu = [
        /*{
            label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => this.props.history.push('/dashboard')
        },*/
        {
            label: 'Handlers', icon: 'pi pi-fw pi-globe',
            items: [
                { label: 'View Handlers', icon: 'pi pi-fw pi-th-large', command: () => this.props.history.push('/handlers') },
                { label: 'New Handler', icon: 'pi pi-fw pi-file', command: () => this.props.history.push('/handlers/create') }
            ],
        },
        {
            label: 'Contribute', icon: 'fas fa-hands-helping', items: [
                { label: 'Donate', icon: 'fab fa-cc-paypal', command: () => window.open(Urls.Donate) },
                { label: 'Report a bug', icon: 'fas fa-bug', command: () => window.open(Urls.IssuesList) },
                //{ label: 'View source', icon: 'fas fa-code-branch', command: () => window.open(Urls.Sourcecode) }
            ]
        },
        {
            label: 'Documentation', icon: 'pi pi-fw pi-search', command: () => window.open(Urls.Documentation)
        }
    ];

    componentDidMount() {
        this.props.loadSettings();
    }

    render() {
        const { extensionEnabled, enableExtension, disableExtension } = this.props;

        const start = (
            <>
                <span className="fa fa-random" />
                <span className="title">Dev Assistant</span>
            </>
        );

        const end = (
            <InputSwitch checked={this.props.extensionEnabled} onChange={extensionEnabled ? disableExtension : enableExtension} />
        );

        return (<Menubar className="layout-topbar clearfix" model={this.menu} start={start} end={end} />);
    }
}

export default connect(({ settings: { extensionEnabled } }) => {
    return { extensionEnabled };
}, actions)(withRouter(Header));