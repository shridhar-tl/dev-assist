
import { Settings as actions } from '../action-types';
import { getObj, sendMessage } from '../helpers';
import { settingsTable } from '../database';

const Settings = {
    ExtensionEnabled: 'extensionEnabled'
};

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
        const settingsFromDB = (await settingsTable.toArray()).reduce((set, cur) => {
            set[cur.id] = cur.value;

            return set;
        }, {});

        dispatch(getObj(actions.LoadSettings, settingsFromDB));
    }
}
