import { Handler } from '../action-types';
import { handlersTable } from '../database';
import { UUID } from '../../common/common';
import { FilterTypes, ActionTypes } from '../../common/constants';

export function saveHandler(handler) {
    return async function (dispatch) {
        const { name, desc, filters, actions } = handler;
        let { id, enabled, created, modified } = handler;

        enabled = enabled && !!actions?.length;

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

        handler = { id, name, desc, filters, actions, enabled, created, modified };
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

export function loadActiveHandlers() {
    return async function (dispatch) {
        const listFromDB = await handlersTable.toArray()
        const list = listFromDB.filter(h => h.enabled);

        const handlersUsingHeaders = list.filter(checkIfHeadersUsed);
        const ids = handlersUsingHeaders.map(h => h.id);

        const loadProxyHandler = list.some(checkIfProxyIsUsed);

        const handlersNotUsingHeaders = list.filter(({ id }) => !ids.includes(id))

        dispatch(getObj(Handler.SetActiveHandlers, { handlersUsingHeaders, handlersNotUsingHeaders, loadProxyHandler }));
    }
}

function checkIfHeadersUsed({ filters, actions }) {
    return filters.some(f => f.id === FilterTypes.Header || (f.id === FilterTypes.FilterGroup && checkIfHeadersUsed(f)))
        ||
        actions.some(a => a.id === ActionTypes.ModifyHeader); // If action contains header modification
}

function checkIfProxyIsUsed({ actions }) {
    return actions.some(a => a.id === ActionTypes.ApplyProxy);
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

function getObj(type, payload) { return { type, payload }; }

function getHandlerObjectForDisplay({ id, name, desc, enabled, created, modified }) {
    return {
        id, name, desc, enabled,
        created: created.toLocaleString(),
        modified: modified?.toLocaleString()
    };
}

function sendMessage() {
    window["chrome"].runtime.sendMessage({ type: 'handlerEdited' });
}