import { PureComponent } from 'react';

class BasePage extends PureComponent {
    render() {
        return (
            this.renderPage()
        );
    }
}

export default BasePage;