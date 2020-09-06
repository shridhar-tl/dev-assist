import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import './Common.scss';

class Default extends PureComponent {
    render() {
        return (
            <div className="layout-container" onClick={this.onWrapperClick}>
                <Header />
                <Content />
                <Footer />
                <div className="layout-mask"></div>
            </div>
        );
    }
}

export default connect(({ settings: { layout } }) => layout)(Default);