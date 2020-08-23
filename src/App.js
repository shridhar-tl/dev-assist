import React, { PureComponent } from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { initStore } from './store';
import 'primereact/resources/themes/bootstrap4-light-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/styles.scss';
import Default from './layout/Default';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.initApp();
  }

  initApp() {
    this.store = initStore();
  }

  render() {
    return (
      <HashRouter>
        <Provider store={this.store}>
          <Default />
        </Provider>
      </HashRouter>
    );
  }
}

export default App;
