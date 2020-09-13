import { Handler } from '../action-types';
import { getObj, sendMessage } from '../helpers';
import { handlersTable } from '../database';
import { UUID } from '../../common/common';
import { saveAs } from '../../common/utils';

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

export function downloadHandlers(ids) {
    return async function () {
        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        const handlers = await handlersTable.where('id').anyOf(ids).toArray();
        const toExport = handlers.reduce((result, h) => {
            const { id } = h;

            delete h.enabled;
            delete h.id;
            h.created = h.created.getTime();
            h.modified = h.modified?.getTime();
            result[id] = h;

            return result;
        }, {});

        toExport.dateCreated = new Date().getTime();
        toExport.itemsCount = handlers.length;

        const exportStr = JSON.stringify(toExport);

        saveAs(exportStr, `Handlers_${handlers.length}_${new Date().format('yyyy-MM-dd')}.dah`);
    }
}

export function importHandlers(json) {
    return function (dispatch) {
        const handlers = JSON.parse(json);
        prepareImport(dispatch, handlers);
    }
}

async function prepareImport(dispatch, handlers, sample) {
    const { dateCreated, itemsCount, ...handlersMap } = handlers;
    const handlerIds = Object.keys(handlersMap);

    let existingHandlers = {};

    if (!sample) {
        existingHandlers = (await handlersTable.bulkGet(handlerIds))
            .reduce((obj, h) => {
                if (h) {
                    const { id } = h;
                    obj[id] = true;
                }

                return obj;
            }, {});
    }

    const toImport = handlerIds.map(id => {
        if (id.length < 30) {
            delete handlersMap[id];
            return null;
        }

        const { filters, actions } = handlers[id];

        if (filters && !Array.isArray(filters)) {
            delete handlersMap[id];
            return null;
        }

        if (actions && !Array.isArray(actions)) {
            delete handlersMap[id];
            return null;
        }

        let { created, modified } = handlers[id];

        delete handlers[id].created;
        delete handlers[id].modified;

        created = new Date(created);

        if (modified) {
            modified = new Date(modified);
        }

        const lastEdited = (modified || created).toLocaleString();

        const { name, desc, hasError } = handlers[id];

        const obj = { id, name, desc, lastEdited, hasError, exist: existingHandlers[id] };

        return obj;
    }).filter(Boolean);

    dispatch(getObj(Handler.ImportHandler, { sampleImport: sample, handlers: toImport, handlersMap, dateCreated, itemsCount }));
}

export function clearImports() {
    return function (dispatch) {
        dispatch(getObj(Handler.ClearImport));
    }
}

export function importSelection(ids, handlers, createNew) {
    return async function (dispatch) {
        const toImport = ids.map(id => {
            const handler = handlers[id];
            handler.created = new Date();
            handler.enabled = false;
            handler.id = createNew ? UUID.generate() : id;

            return handler;
        });

        await handlersTable.bulkPut(toImport);
        loadHandlersList()(dispatch);
    }
}

export function showQuickHandlers() {
    return async function (dispatch) {
        const handlers = await (await fetch('/sample-handlers.json')).json();
        prepareImport(dispatch, handlers, true);
    }
}