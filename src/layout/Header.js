import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';

class Header extends PureComponent {
    menu = [
        {
            label: 'Dashboard', icon: 'pi pi-fw pi-home', command: () => { }
        },
        {
            label: 'Handlers', icon: 'pi pi-fw pi-globe',
            items: [
                { label: 'View Handlers', icon: 'pi pi-fw pi-th-large', command: () => this.props.history.push('/handlers') },
                { label: 'New Handler', icon: 'pi pi-fw pi-file', command: () => this.props.history.push('/handlers/create') }
            ],
        },
        {
            label: 'Contribute', icon: '', items: [
                { label: 'Donate', icon: '' },
                { label: 'Report a bug', icon: '' },
                { label: 'View source', icon: 'pi pi-fw pi-search' }
            ]
        },
        {
            label: 'Documentation', icon: 'pi pi-fw pi-question'
        }
    ];

    render() {
        const start = (
            <span>Dev Assistant</span>
        );
        const end = (
            <span>...</span>
        );

        return (<Menubar className="layout-topbar clearfix" model={this.menu} start={start} end={end} />);
    }
}

export default withRouter(Header);