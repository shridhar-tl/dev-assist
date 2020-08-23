import { getApplicableHandlers, refreshHandlers, store, getHeaderObj } from './handler-helpers';
import { ActionTypes, ActionModifyItemType } from './constants';
import { parseCookie, changeHeader, setCookie, replaceUrl } from './action-helpers';

console.log('Background script started');

const chrome = window['chrome'];

chrome.runtime.onMessage.addListener(function ({ type }, callback) {
    if (type === 'handlerEdited') {
        console.log('About to refresh handlers.');
        refreshHandlers();
    }
});

let attached_onBeforeRequest = false;
let attached_onBeforeSendHeaders = false;
let attached_proxy = false;

store.subscribe(checkStoreAndInitListener);

checkStoreAndInitListener();

function checkStoreAndInitListener() {
    initBeforeRequestHandler();
    initBeforeSendHeaderHandler();
    initProxyHandler();
}

function initBeforeRequestHandler() {
    const hasHandlersWithoutUsingHeaders = store.getState().handlers?.handlersNotUsingHeaders?.length > 0;

    if (hasHandlersWithoutUsingHeaders) {
        if (!attached_onBeforeRequest) {
            // Filter out things which doesn't have headers
            chrome.webRequest.onBeforeRequest.addListener(onBeforeRequest,
                { urls: ['<all_urls>'] }, ['blocking', 'extraHeaders', 'requestBody']);
            attached_onBeforeRequest = true;
        }
    }
    else {
        chrome.webRequest.onBeforeRequest.removeListener(onBeforeRequest);
        attached_onBeforeRequest = false;
    }
}

function initBeforeSendHeaderHandler() {
    const hasFiltersWithHeaders = store.getState().handlers?.handlersUsingHeaders?.length > 0;

    if (hasFiltersWithHeaders) {
        if (!attached_onBeforeSendHeaders) {
            // Filter out things which have headers
            chrome.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders,
                { urls: ['<all_urls>'] }, ['blocking', 'extraHeaders', 'requestHeaders']);
            attached_onBeforeSendHeaders = true;
        }
    }
    else {
        chrome.webRequest.onBeforeSendHeaders.removeListener(onBeforeSendHeaders);
        attached_onBeforeSendHeaders = false;
    }
}

function initProxyHandler() {
    const loadProxyHandler = store.getState().handlers?.loadProxyHandler;

    if (loadProxyHandler) {
        if (!attached_proxy) {
            console.log('ToDo: Proxy has to be attached');
            attached_proxy = true;
        }
    }
    else {
        if (attached_proxy) {
            console.log('ToDo: Proxy has to be detached');
            attached_proxy = false;
        }
    }
}

function onBeforeRequest(details, a, b) {
    console.log('onBeforeRequest', details, a, b);

    const { tabId, initiator, method, parentFrameId, timeStamp, type, url } = details;

    return processRequest({ tabId, initiator, method, parentFrameId, timeStamp, type, url }, true);
}

function onBeforeSendHeaders(details, a, b) {
    console.log('onBeforeSendHeaders', details, a, b);

    const { tabId, initiator, method, parentFrameId, timeStamp, type, url, requestHeaders } = details;

    return processRequest({ tabId, initiator, method, parentFrameId, timeStamp, type, url, requestHeaders }, true);
}

function processRequest(request, preRequest) {
    const handlers = getApplicableHandlers(request, preRequest);

    if (!request.requestHeaders) {
        request.requestHeaders = [];
    }

    return handlers.reduce((res, { actions }) => applyActions(res, actions, request), {});
}

function applyActions(response, actions, request) {
    const { tabId, initiator, method, parentFrameId, type, url, requestHeaders } = request;
    //https://developer.chrome.com/extensions/webRequest#type-RequestFilter

    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const { key, value } = action;

        switch (action.id) {
            case ActionTypes.BlockRequest:
                response.cancel = true;
                break;

            case ActionTypes.Redirectrequest:
                response.redirectUrl = replaceUrl(url, key, value);
                break;

            case ActionTypes.ReplaceReferrer:
                const referrerObj = getHeaderObj(requestHeaders, key);
                const newUrl = replaceUrl(referrerObj?.value || url, key, value);
                if (referrerObj) {
                    referrerObj.value = newUrl;
                } else {
                    requestHeaders.push({ name: key, value: newUrl });
                }
                break;

            case ActionTypes.ModifyQueryParam:
                const urlObj = new URL(url);
                const params = urlObj.searchParams;

                switch (action.type) {
                    case ActionModifyItemType.Add:
                        if (!params.has(key) && value) {
                            params.append(key, value);
                        }
                        break;

                    case ActionModifyItemType.Remove:
                        if (params.has(key)) {
                            params.delete(key);
                        }
                        break;

                    case ActionModifyItemType.Modify:
                        if (params.has(key)) {
                            params.delete(key);
                            params.append(key, value);
                        }
                        break;

                    default:
                        if (params.has(key)) {
                            params.delete(key);
                        }
                        params.append(key, value);
                        break;
                }

                response.redirectUrl = urlObj.href;

                break;

            case ActionTypes.ModifyHeader:
                if (!key) { continue; }

                response.requestHeaders = changeHeader(key, value, requestHeaders, action.type);
                break;

            case ActionTypes.ModifyUserAgent:
                response.requestHeaders = changeHeader('User-Agent', value, requestHeaders);
                break;

            case ActionTypes.ModifyRequestCookie:
                if (!requestHeaders) { continue; }

                let cookieHeader = requestHeaders.find(h => h.name.toLowerCase() === 'cookie');
                let cookieHeaderExists = true;

                if (!cookieHeader) {
                    cookieHeader = { name: 'Cookie', value: '' };
                    cookieHeaderExists = false;
                }

                // Parse the key value string as object for easy modification
                let cookies = cookieHeader.value ? parseCookie(cookieHeader.value) : {};

                // Modify object to update the cookie
                cookies = setCookie(key, value, cookies, action.type);

                // Form cookie as string again
                cookieHeader.value = Object.keys(cookies).reduce((str, key) => {
                    return `${str};${key}=${cookies[key]}`;
                }, "").substring(1);

                // If cookie header doesn't already exist, then add the object to the headers list
                if (!cookieHeaderExists) {
                    requestHeaders.push(cookieHeader);
                    response.requestHeaders = requestHeaders;
                }

                break;


            case ActionTypes.ModifyResponseCookies: break;


            case ActionTypes.AddCustomScript: break;

            case ActionTypes.CloseTab:
                chrome.tabs.remove(tabId);
                break;


            case ActionTypes.ApplyProxy:
                break;

            case ActionTypes.ShowNoti: break;

            default:
                console.error("Unknown handler action identifyed");
                break;
        }
    }

    return response;
}
