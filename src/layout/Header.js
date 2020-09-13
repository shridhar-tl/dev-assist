import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menubar } from 'primereact/menubar';
import { InputSwitch } from 'primereact/inputswitch';
import { Tooltip } from 'primereact/tooltip';
import { loadSettings, enableExtension, disableExtension } from '../store/actions/settings';
import { showQuickHandlers } from '../store/actions/handlers';
import { Urls } from '../common/constants';

const tooltipLeft = { position: 'left' };

const actions = { loadSettings, enableExtension, disableExtension, showQuickHandlers };

class Header extends PureComponent {
    menu = [
        /*{
            label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => this.props.history.push('/dashboard')
        },*/
        {
            label: 'Handlers', icon: 'pi pi-fw pi-globe',
            items: [
                { label: 'View Handlers', icon: 'pi pi-fw pi-th-large', command: () => this.props.history.push('/handlers') },
                { label: 'New Handler', icon: 'pi pi-fw pi-file', command: () => this.props.history.push('/handlers/create') },
                { label: 'Quick Samples', icon: 'pi pi-fw pi-file', command: () => this.props.showQuickHandlers() },
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
        const { extensionEnabled, enableExtension, disableExtension, isAllowedIncognitoAccess } = this.props;

        const start = (
            <>
                <span className="fa fa-random" />
                <span className="title">Dev Assistant</span>
            </>
        );

        const end = (
            <>
                {!isAllowedIncognitoAccess && <>
                    <Tooltip target=".incognito-error" position="left" />
                    <span className="pi pi-exclamation-triangle incognito-error" data-pr-tooltip="Incognito access not provided" />
                </>}
                <InputSwitch checked={extensionEnabled}
                    onChange={extensionEnabled ? disableExtension : enableExtension}
                    tooltip={`Click to ${extensionEnabled ? "disable" : "enable"} this extenstion`}
                    tooltipOptions={tooltipLeft} />
            </>
        );

        return (<Menubar className="layout-topbar clearfix" model={this.menu} start={start} end={end} />);
    }
}

export default connect(({ settings: { extensionEnabled, isAllowedIncognitoAccess } }) => {
    return { extensionEnabled, isAllowedIncognitoAccess };
}, actions)(withRouter(Header));