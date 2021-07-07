import React, { PureComponent } from 'react';

class Footer extends PureComponent {
    render() {
        return (
            <div className="layout-footer">
                <span className="footer-text" style={{ 'marginRight': '5px' }}>Dev Assistant v1.0</span>
                <img src="assets/layout/images/logo.svg" alt="" width="80" />
                <div className="pull-right">
                    <span className="footer-text" style={{ 'marginRight': '5px' }}>Copyrights &copy; 2018 - {new Date().getFullYear()}</span>
                </div>
            </div>
        );
    }
}

export default Footer;