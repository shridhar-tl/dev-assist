import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

let store = null;

export function initStore() {
    const initialState = {
        settings: {
            layout: {
                layoutMode: 'static',
                layoutColorMode: 'dark',
                staticMenuInactive: false,
                overlayMenuActive: false,
                mobileMenuActive: false
            }
        },
        user: {
            displayName: 'Shridhar TL'
        },
        handlers: {
            list: []
        }
    };

    store = createStore(reducer, initialState, applyMiddleware(thunk));

    return store;
}