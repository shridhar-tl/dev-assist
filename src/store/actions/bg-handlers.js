import { FilterTypes, ActionTypes } from '../../common/constants';
import { Handler } from '../action-types';
import { getObj } from '../helpers';
import { handlersTable } from '../database';

export async function loadActiveHandlers(dispatch) {
    const listFromDB = await handlersTable.toArray()
    const list = listFromDB.filter(h => h.enabled);

    const handlersUsingHeaders = list.filter(checkIfHeadersUsed);
    let ids = handlersUsingHeaders.map(h => h.id);

    let handlersNotUsingHeaders = list.filter(({ id }) => !ids.includes(id));

    const handlersForProxyOnly = handlersNotUsingHeaders.filter(checkIfProxyOnlyHandler);
    ids = handlersForProxyOnly.map(h => h.id);

    handlersNotUsingHeaders = handlersNotUsingHeaders.filter(({ id }) => !ids.includes(id));

    const hasHandlersModifyingResponseHeaders = list.some(checkIfHandlersModifyResponseHeaders);

    dispatch(getObj(Handler.SetActiveHandlers, {
        handlersUsingHeaders,
        handlersNotUsingHeaders,
        handlersForProxyOnly,
        hasHandlersModifyingResponseHeaders,
        count: list.length
    }));
}

function checkIfHandlersModifyResponseHeaders({ actions }) {
    if (!actions?.length) { return false; }

    return actions.some(({ id }) => id === ActionTypes.ModifyResponseHeader || id === ActionTypes.ModifyResponseCookies);
}

function checkIfHeadersUsed({ filters, actions }) {
    return filters?.some(f => f.id === FilterTypes.Header
        || f.id === FilterTypes.ReferrerUrl
        || (f.id === FilterTypes.FilterGroup && checkIfHeadersUsed(f)))
        ||
        actions?.some(a => a.id === ActionTypes.ModifyHeader
            || a.id === ActionTypes.ModifyUserAgent
            || a.id === ActionTypes.ReplaceReferrer
            || a.id === ActionTypes.ModifyRequestCookie
            || a.id === ActionTypes.ModifyResponseCookies
        ); // If action contains header modification
}

const allowedFilterForProxy = [
    FilterTypes.HostName,
    FilterTypes.QueryParam,
    FilterTypes.Url,
    FilterTypes.TimeOfDay,
    FilterTypes.DayOfWeek
];

function checkIfProxyOnlyHandler({ filters, actions }) {
    filters = filters || [];

    return actions?.length === 1 && actions[0].id === ActionTypes.ApplyProxy
        &&
        filters.every(f => allowedFilterForProxy.includes(f.id) || (f.id === FilterTypes.FilterGroup && checkIfProxyOnlyHandler(f)));
}