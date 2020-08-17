import { combineReducers } from 'redux';
import settings from './settings';
import handlers from './handlers';

export default combineReducers({ settings, user: settings, handlers });
