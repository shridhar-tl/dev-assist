import { Handler } from '../action-types';
import { getObj, sendMessage } from '../helpers';
import { handlersTable } from '../database';
import { UUID } from '../../common/common';

export function saveHandler(handler) {
    return async function (dispatch) {
        const { name, desc, filters, actions, hasError } = handler;
        let { id, enabled, created, modified } = handler;

        enabled = enabled && !hasError;

        if (!id) {
            id = UUID.generate();
            created = new Date();
            modified = undefined;
        }
        else {
            modified = new Date();
        }

        // This is a workaround to solve an issue
        if (!created) {
            created = new Date();
        }

        handler = { id, name, desc, filters, actions, enabled, created, modified, hasError };
        await handlersTable.put(handler);

        dispatch(getObj(Handler.Save, getHandlerObjectForDisplay(handler)));

        if (modified || enabled) {
            sendMessage();
        }
    }
}

export function loadHandlersList() {
    return async function (dispatch) {
        const listFromDB = await handlersTable.toArray()
        const list = listFromDB.map(getHandlerObjectForDisplay);

        dispatch(getObj(Handler.SetList, list));
    }
}

export function getHandlerForEdit(id) {
    return function () {
        return handlersTable.get(id);
    }
}

export function updateStatus(id, enabled) {
    return async function (dispatch) {
        let handler = await handlersTable.get(id);

        if (handler) {
            if (enabled) {
                enabled = !handler.hasError;
            }

            if (handler.enabled === enabled) {
                return;
            }

            handler = { ...handler, enabled, modified: new Date() };
            await handlersTable.put(handler);
            dispatch(getObj(Handler.UpdateHandler, getHandlerObjectForDisplay(handler)));
            sendMessage();
        }
    }
}

export function deleteHandlers(ids) {
    return async function (dispatch) {
        if (Array.isArray(ids)) {
            await handlersTable.bulkDelete(ids);
        }
        else {
            await handlersTable.delete(ids);
        }

        dispatch(getObj(Handler.Delete, ids));
        sendMessage();
    }
}

function getHandlerObjectForDisplay({ id, name, desc, enabled, created, modified }) {
    return {
        id, name, desc, enabled,
        created: created.toLocaleString(),
        modified: modified?.toLocaleString()
    };
}
