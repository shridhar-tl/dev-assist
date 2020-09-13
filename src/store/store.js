import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Settings } from '../common/constants';
import reducer from './reducers';

let store = null;

export function initStore() {
    const initialState = {
        settings: {
            [Settings.ExtensionEnabled]: true
        },
        handlers: {
            list: []
        }
    };

    store = createStore(reducer, initialState, applyMiddleware(thunk));

    return store;
}