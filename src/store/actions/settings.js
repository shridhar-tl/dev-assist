/* global chrome */
import { Settings as actions } from '../action-types';
import { getObj, sendMessage } from '../helpers';
import { settingsTable } from '../database';
import { Settings } from '../../common/constants';

export function enableExtension() {
    return async function (dispatch) {
        await updateStore(dispatch, Settings.ExtensionEnabled, true);
    };
}

export function disableExtension() {
    return async function (dispatch) {
        await updateStore(dispatch, Settings.ExtensionEnabled, false);
    };
}

async function updateStore(dispatch, key, value) {
    await settingsTable.put({ id: key, value, modified: new Date() });

    dispatch(getObj(actions.UpdateSetting, { key, value }));
    sendMessage('updateSettings');
}

export function loadSettings() {
    return async function (dispatch) {
        const browserSettings = await getBrowserSettings();
        const settingsFromDB = (await settingsTable.toArray()).reduce((set, cur) => {
            set[cur.id] = cur.value;

            return set;
        }, browserSettings);

        dispatch(getObj(actions.LoadSettings, settingsFromDB));
    }
}

function getBrowserSettings() {
    return new Promise(function (resolve) {
        chrome.extension.isAllowedIncognitoAccess(function (allowed) {
            resolve({ isAllowedIncognitoAccess: allowed });
        });
    });
}