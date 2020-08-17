import { Handler } from '../action-types';
import { handlersTable } from '../database';
import { UUID } from '../../common/common';

export function saveHandler(handler) {
    return async function (dispatch) {
        const { name, desc, filters, actions } = handler;
        let { id, enabled, created, modified } = handler;

        let isValid = true;

        enabled = enabled && !!actions?.length;

        if (!id) {
            id = UUID.generate();
            created = new Date();
        }
        else {
            modified = new Date();
        }

        handler = { id, name, desc, filters, actions, enabled, created, modified };
        await handlersTable.put(handler);

        if (isValid) {
            dispatch(getObj(Handler.Save, handler));
        }

        return isValid;
    }
}

export function loadHandlersList() {
    return async function (dispatch) {
        const listFromDB = await handlersTable.toArray()
        const list = listFromDB.map(({ id, name, desc, enabled, created, modified }) =>
            ({ id, name, desc, enabled, created, modified }));

        dispatch(getObj(Handler.SetList, list));
    }
}

export function updateStatus(id, enabled) {
    return async function (dispatch) {
        let handler = await handlersTable.get(id);

        if (handler) {
            handler = { ...handler, enabled };
            await handlersTable.put(handler);
            dispatch(getObj(Handler.UpdateHandler, handler));
        }
    }
}

function getObj(type, payload) { return { type, payload }; }