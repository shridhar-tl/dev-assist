import { FilterTypes, ActionTypes } from '../../common/constants';
import { Handler } from '../action-types';
import { getObj } from '../helpers';
import { handlersTable } from '../database';

export async function loadActiveHandlers(dispatch) {
    const listFromDB = await handlersTable.toArray()
    const list = listFromDB.filter(h => h.enabled && !!h.actions?.length);

    const handlersUsingHeaders = list.filter(checkIfHeadersUsed);
    let ids = handlersUsingHeaders.map(h => h.id);

    let handlersNotUsingHeaders = list.filter(({ id }) => !ids.includes(id));

    const handlersForProxyOnly = handlersNotUsingHeaders.filter(checkIfProxyOnlyHandler);
    ids = handlersForProxyOnly.map(h => h.id);

    handlersNotUsingHeaders = handlersNotUsingHeaders.filter(({ id }) => !ids.includes(id));

    const hasHandlersModifyingResponseHeaders = list.some(checkIfResponseActionsAdded);

    dispatch(getObj(Handler.SetActiveHandlers, {
        handlersUsingHeaders,
        handlersNotUsingHeaders,
        handlersForProxyOnly,
        hasHandlersModifyingResponseHeaders,
        count: list.length
    }));
}

function checkIfResponseActionsAdded({ actions }) {
    return actions.some(({ id }) => id === ActionTypes.ModifyResponseHeader
        || id === ActionTypes.ModifyResponseCookies
        || id === ActionTypes.AddCustomJS
        || id === ActionTypes.AddCustomCSS
    );
}

function checkIfHeadersUsed({ filters, actions }) {
    return filters?.some(f => f.id === FilterTypes.Header
        || f.id === FilterTypes.ReferrerUrl
        || (f.id === FilterTypes.FilterGroup && checkIfHeadersUsed(f)))
        ||
        actions.some(a => a.id === ActionTypes.ModifyHeader
            || a.id === ActionTypes.ModifyUserAgent
            || a.id === ActionTypes.ReplaceReferrer
            || a.id === ActionTypes.ModifyRequestCookie
            || a.id === ActionTypes.ModifyResponseCookies
        ); // If action contains header modification
}

const allowedFilterForProxy = [
    FilterTypes.RequestProtocol,
    FilterTypes.HostName,
    FilterTypes.RequestPort,
    FilterTypes.Url,
    FilterTypes.QueryParam,
    FilterTypes.TimeOfDay,
    FilterTypes.DayOfWeek
];

function checkIfProxyOnlyHandler({ filters, actions }) {
    filters = filters || [];

    return actions.length === 1 && actions[0].id === ActionTypes.ApplyProxy
        &&
        filters.every(f => allowedFilterForProxy.includes(f.id) || (f.id === FilterTypes.FilterGroup && checkIfProxyOnlyHandler(f)));
}