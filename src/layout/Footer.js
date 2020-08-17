import React, { PureComponent } from 'react';

class Footer extends PureComponent {
    render() {
        return (
            <div className="layout-footer">
                <span className="footer-text" style={{ 'marginRight': '5px' }}>DevAssist</span>
                <img src="assets/layout/images/logo.svg" alt="" width="80" />
                <span className="footer-text" style={{ 'marginLeft': '5px' }}>Developer tools</span>
            </div>
        );
    }
}

export default Footer;