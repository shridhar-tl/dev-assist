import { initStore } from '../store';
import { loadActiveHandlers } from '../store/actions/bg-handlers';
import { loadSettings } from '../store/actions/settings';

export const store = initStore();
let handlersUsingHeaders = [];
let handlersNotUsingHeaders = [];
let hasHandlersModifyingResponseHeaders = false;
let enabledCount = 0;

// When the store is updated, get the active handlers list from store
store.subscribe(() => {
    const handlers = store.getState().handlers;
    handlersUsingHeaders = handlers?.handlersUsingHeaders || [];
    handlersNotUsingHeaders = handlers?.handlersNotUsingHeaders || [];
    hasHandlersModifyingResponseHeaders = handlers?.hasHandlersModifyingResponseHeaders;
    enabledCount = handlers?.count;
});

loadAppSettings();
refreshHandlers();

// This function will refresh the store with active handlers list data from db
export function refreshHandlers() {
    loadActiveHandlers(store.dispatch);
}

export function loadAppSettings() {
    loadSettings()(store.dispatch);
}

export function getHandlersToUse(preRequest) {
    return preRequest ? handlersNotUsingHeaders : handlersUsingHeaders;
}

export function getEnabledCount() {
    return enabledCount;
}

export function shouldAtachResponseHandler() {
    return hasHandlersModifyingResponseHeaders;
}