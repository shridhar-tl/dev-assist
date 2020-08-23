import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

class Default extends PureComponent {

    render() {
        //const { layoutMode, layoutColorMode, staticMenuInactive, overlayMenuActive, mobileMenuActive } = this.props;

        /*
        const wrapperClass = classNames('layout-wrapper', {
            'layout-overlay': layoutMode === 'overlay',
            'layout-static': layoutMode === 'static',
            'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
            'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
            'layout-mobile-sidebar-active': mobileMenuActive
        });

        const sidebarClassName = classNames("layout-sidebar", {
            'layout-sidebar-dark': layoutColorMode === 'dark',
            'layout-sidebar-light': layoutColorMode === 'light'
        });*/

        return (
            <div className="layout-container" onClick={this.onWrapperClick}>
                <Header />
                {/*<Sidebar className={sidebarClassName} />*/}
                <Content />
                <Footer />
                <div className="layout-mask"></div>
            </div>
        );
    }
}

export default connect(({ settings: { layout } }) => layout)(Default);