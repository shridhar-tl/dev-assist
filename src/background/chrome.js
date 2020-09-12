/* global chrome */
import { refreshHandlers, loadAppSettings, store, getHandlersToUse, getEnabledCount, shouldAtachResponseHandler } from './helpers-store';
import { canProcessRequest } from './helpers-handler';
import { filterHandlersForRequest } from './helpers-filter';
import { applyActions, applyResponseActions } from './helpers-action';
import { getPACScript } from './helpers-proxy';
import { Settings } from '../common/constants';

console.log('Background script started');

chrome.runtime.onMessage.addListener(function ({ type }, callback) {
    if (type === 'handlerEdited') {
        console.log('About to refresh handlers.');
        refreshHandlers();
    }
    else if (type === 'updateSettings') {
        console.log('About to reload settings.');
        loadAppSettings();
    }
});

let isHandlersEnabled = false;

store.subscribe(checkStoreAndInitListener);

function checkStoreAndInitListener() {
    console.log('About to init listener');
    const { handlers, settings: { [Settings.ExtensionEnabled]: isEnabled } } = store.getState();
    isHandlersEnabled = isEnabled;

    initBeforeRequestHandler(handlers);
    initBeforeSendHeaderHandler(handlers);
    initHeadersReceivedHandler(handlers);
    initProxyHandler(handlers);

    const count = isEnabled && getEnabledCount();
    chrome.browserAction.setBadgeText({ text: count > 0 ? count.toString() : (isEnabled ? 'ON' : 'OFF') });
    chrome.browserAction.setBadgeBackgroundColor({ color: count > 0 ? '#00FF00' : (isEnabled ? '#ffc107' : '#dc3545') });
}

function initBeforeRequestHandler(handlers) {
    const hasHandlersWithoutUsingHeaders = handlers.handlersNotUsingHeaders?.length > 0;
    const hasListener = chrome.webRequest.onBeforeRequest.hasListeners();

    if (hasHandlersWithoutUsingHeaders && isHandlersEnabled) {
        if (!hasListener) {
            chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest,
                { urls: ['<all_urls>'] }, ['blocking', 'extraHeaders', 'requestBody']);

            console.log("Attached onBeforeRequest handler");
        }
    }
    else if (hasListener) {
        chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest);

        console.log("Detached onBeforeRequest handler");
    }
}

function initBeforeSendHeaderHandler(handlers) {
    const hasFiltersWithHeaders = handlers.handlersUsingHeaders?.length > 0;
    const hasListener = chrome.webRequest.onBeforeSendHeaders.hasListeners();

    if (hasFiltersWithHeaders && isHandlersEnabled) {
        if (!hasListener) {
            // Filter out things which have headers
            chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders,
                { urls: ['<all_urls>'] }, ['blocking', 'extraHeaders', 'requestHeaders']);

            console.log("Attached onBeforeSendHeaders handler");
        }
    }
    else if (hasListener) {
        chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeaders);

        console.log("Detached onBeforeSendHeaders handler");
    }
}

let attached_proxy = false;
function initProxyHandler(handlers) {
    const handlersForProxyOnly = handlers.handlersForProxyOnly;

    if (attached_proxy) {
        chrome.proxy.settings.clear({ scope: 'regular' });
        console.log('Cleared proxy settings');
        attached_proxy = true;
    }

    if (!handlersForProxyOnly?.length || isHandlersEnabled) {
        return;
    }

    console.log('About to attach proxy with below script');

    const script = getPACScript(handlersForProxyOnly);

    console.log(script);

    const config = {
        mode: "pac_script",
        pacScript: { data: script }
    };
    chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () {
        console.log("Applied proxy with following config:", config);
    });
    attached_proxy = true;
}

function initHeadersReceivedHandler() {
    const hasListener = chrome.webRequest.onHeadersReceived.hasListeners();

    if (shouldAtachResponseHandler() && isHandlersEnabled) {
        if (!hasListener) {
            chrome.webRequest.onHeadersReceived.addListener(onHeadersReceived,
                { urls: ['<all_urls>'] }, ['blocking', 'extraHeaders', 'responseHeaders']);

            console.log("Attached onHeadersReceived handler");
        }
    }
    else if (hasListener) {
        chrome.webRequest.onHeadersReceived.removeListener(onHeadersReceived);

        console.log("Detached onHeadersReceived handler");
    }
}

function onBeforeRequest(request) {
    return processRequest(request, true);
}

function onBeforeSendHeaders(request) {
    return processRequest(request, false);
}

function onHeadersReceived(response) {
    return processResponse(response);
}

function processRequest(request, preRequest) {
    if (!canProcessRequest(request)) {
        return;
    }

    const handlers = filterHandlersForRequest(request, getHandlersToUse(preRequest));

    if (!request.requestHeaders) {
        request.requestHeaders = [];
    }

    return handlers.reduce((res, { actions }) => applyActions(res, actions, request), {});
}

function processResponse(response) {
    return applyResponseActions(response);
}