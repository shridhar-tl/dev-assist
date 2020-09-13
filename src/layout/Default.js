import React, { PureComponent } from 'react';
import { Toast } from 'primereact/toast';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { setConfirmHandle } from '../common/toast';
import './Common.scss';

class Default extends PureComponent {
    render() {
        return (
            <div className="layout-container" onClick={this.onWrapperClick}>
                <Toast ref={setConfirmHandle} position="top-center" />
                <Header />
                <Content />
                <Footer />
                <div className="layout-mask"></div>
            </div>
        );
    }
}

export default Default;