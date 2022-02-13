/* global chrome */
import array from '../common/js-extn';
import { ActionModifyItemType, ActionTypes } from '../common/constants';
import { getHeaderObj } from './helpers-common';
import { getHostInfoFromUrl } from '../common/common';
import { getProxyConfig } from './helpers-proxy';

const responseActions = {};
const proxyActions = {};

export function applyActions(response, actions, request) {
    const { requestId, tabId, requestHeaders } = request;
    let { url } = request;
    //https://developer.chrome.com/extensions/webRequest#type-RequestFilter

    for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        const { key, value } = action;

        switch (action.id) {
            case ActionTypes.BlockRequest:
                response.cancel = true;
                break;

            case ActionTypes.Redirectrequest:
                url = replaceUrl(url, key, value);
                response.redirectUrl = url;
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

                url = urlObj.href;
                response.redirectUrl = url;

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
                response.requestHeaders = changeCookies(requestHeaders, key, value, action.type);
                break;


            case ActionTypes.ModifyResponseHeader:
            case ActionTypes.ModifyResponseCookies:
            case ActionTypes.AddCustomJS:
            case ActionTypes.AddCustomCSS:
                const responseAction = responseActions[requestId];
                if (responseAction) {
                    responseAction.push(action);
                } else {
                    responseActions[requestId] = [action];
                }
                break;

            case ActionTypes.CloseTab:
                chrome.tabs.remove(tabId);
                break;


            case ActionTypes.ApplyProxy:
                proxyActions[url] = getProxyConfig(action.mode, value);
                break;

            case ActionTypes.ShowNoti: break;

            default:
                console.error("Unknown handler action identifyed");
                break;
        }
    }

    return response;
}

export function applyResponseActions(response) {
    const { requestId, url, responseHeaders } = response;
    const actions = responseActions[requestId];

    if (!actions?.length) {
        return;
    }

    const output = {};

    for (let action of actions) {
        const { id, key, value, type } = action;

        if (id === ActionTypes.ModifyResponseHeader) {
            if (!key) { continue; }

            output.responseHeaders = changeHeader(key, value, responseHeaders, type);
        }
        else if (id === ActionTypes.ModifyResponseCookies) {
            if (!responseHeaders) { continue; }
            output.responseHeaders = changeResponseCookie(responseHeaders, url, key, value, type);
            break;
        }
        else {
            const details = {
                [key ? 'file' : 'code']: value,
                runAt: action.runAt || 'document_start' // this can be even document_end
            };

            const applyCustomScript = () => {
                if (id === ActionTypes.AddCustomJS) {
                    chrome.tabs.executeScript(response.tabId, details);
                }
                else {
                    chrome.tabs.insertCSS(response.tabId, details);
                }
            };

            if (response.type === 'main_frame') {
                setTimeout(applyCustomScript, 500);
            }
            else {
                applyCustomScript();
            }
        }
    }

    return output;
}

function parseCookie(cookie) {
    cookie = cookie.trim().split(';');
    cookie = cookie.reduce((obj, cur) => {
        if (!cur) { return obj; }

        cur = cur.trim().split('=');
        obj[cur[0].trim()] = cur[1].trim();

        return obj;
    }, {});

    return cookie
}

function changeHeader(header, value, requestHeaders, headerActionType) {

    const headerToUpper = header.toUpperCase();

    const index = requestHeaders.findIndex(h => h.name.toUpperCase() === headerToUpper);
    const headerAlreadyExists = index >= 0;

    switch (headerActionType) {
        case ActionModifyItemType.Add:
            if (!headerAlreadyExists && value) {
                requestHeaders.push({ name: header, value });
            }
            break;

        case ActionModifyItemType.Remove:
            if (headerAlreadyExists) {
                requestHeaders.splice(index, 1);
            }
            break;

        case ActionModifyItemType.Modify:
            if (headerAlreadyExists) {
                const headerObj = requestHeaders[index];
                headerObj.value = value;
            }
            break;

        default:
            if (headerAlreadyExists) {
                const headerObj = requestHeaders[index];
                headerObj.value = value;
            }
            else {
                requestHeaders.push({ name: header, value });
            }
            break;
    }

    return requestHeaders;
}

function changeCookies(headers, key, value, type) {
    let cookieHeader = headers.find(h => h.name.toLowerCase() === 'cookie');
    let cookieHeaderExists = true;

    if (!cookieHeader) {
        cookieHeader = { name: 'Cookie', value: '' };
        cookieHeaderExists = false;
    }

    // Parse the key value string as object for easy modification
    let cookies = cookieHeader.value ? parseCookie(cookieHeader.value) : {};

    // Modify object to update the cookie
    cookies = setCookie(key, value, cookies, type);

    // Form cookie as string again
    cookieHeader.value = Object.keys(cookies).reduce((str, key) => {
        return `${str};${key}=${cookies[key]}`;
    }, "").substring(1);

    // If cookie header doesn't already exist, then add the object to the headers list
    if (!cookieHeaderExists) {
        headers.push(cookieHeader);
    }

    return headers;
}

function changeResponseCookie(headers, url, key, newValue, actionType) {
    key = key.toLowerCase();

    switch (actionType) {
        case ActionModifyItemType.Add:
            for (const { name, value } of headers) {
                if (name.toLowerCase() !== 'set-cookie') {
                    continue;
                }

                const startIndex = value.indexOf('=');
                const cookieName = value.substring(0, startIndex).trim();

                if (cookieName.toLowerCase() === key) {
                    return;
                }
            }

            headers.push(createNewCookieObj(url, key, newValue));
            break;

        case ActionModifyItemType.Modify: modifyCookie(headers, key, newValue); break;

        case ActionModifyItemType.Remove:
            array(headers).removeAll(({ name, value }) => {
                if (name.toLowerCase() !== 'set-cookie') {
                    return false;
                }

                const firstIndex = value.indexOf('=');
                const cookieName = value.substring(0, firstIndex).trim().toLowerCase();

                return cookieName === key;
            });
            break;

        default:
            if (!modifyCookie(headers, key, newValue)) {
                headers.push(createNewCookieObj((url, key, newValue)));
            }
            break;
    }


    return headers;
}

function modifyCookie(headers, key, newValue) {
    let changedValue = false;

    for (const cookie of headers) {
        if (cookie.name.toLowerCase() !== 'set-cookie') {
            continue;
        }

        const { value } = cookie;

        const startIndex = value.indexOf('=');
        const cookieName = value.substring(0, startIndex).trim();

        if (cookieName.toLowerCase() !== key) {
            continue;
        }

        const endIndex = value.indexOf(';');

        cookie.value = `${cookieName}=${newValue}${value.substring(endIndex)}`;
        changedValue = true;
    }

    return changedValue;
}

function createNewCookieObj(url, key, value) {
    const { root } = getHostInfoFromUrl(url);
    const expires = new Date();
    expires.setDate(expires.getDate() + 1);

    return { name: 'set-cookie', value: `${key}=${value}; expires=${expires}; path=/; domain=${root}; Secure; SameSite=none` };
}

function setCookie(name, value, cookies, actionType) {
    const keyMap = {};
    Object.keys(cookies).forEach(c => keyMap[c.toUpperCase()] = c);

    const nameToUpper = name.toUpperCase();

    const cookieAlreadyExists = !!keyMap[nameToUpper];

    // Take the name from existing cookie to overcome casing related issues
    if (cookieAlreadyExists) {
        name = keyMap[nameToUpper];
    }

    switch (actionType) {
        case ActionModifyItemType.Add:
        case ActionModifyItemType.Modify:
            if (cookieAlreadyExists) {
                cookies[name] = value;
            }
            break;

        case ActionModifyItemType.Remove:
            if (cookieAlreadyExists) {
                delete cookies[name];
            }
            break;

        default:
            cookies[name] = value;
            break;
    }

    return cookies;
}

function replaceUrl(url, find, replace) {
    const urlObj = new URL(url);

    switch (find) {
        case 'protocol':
            urlObj.protocol = replace;
            break;

        case 'host':
            urlObj.hostname = replace;
            break;

        case 'root-host':
            const subdomain = urlObj.hostname.split('.');
            subdomain.splice(subdomain.length - 2, 2);

            const result = subdomain.length ? subdomain.join('.') + '.' : '';

            urlObj.hostname = result + replace;
            break;

        case 'sub-domain':
            const parts = urlObj.hostname.split('.');
            const rootDomain = parts.splice(parts.length - 2, 2);

            urlObj.hostname = replace + '.' + rootDomain.join('.');
            break;

        case 'domain-extn':
            const extnIndex = urlObj.hostname.lastIndexOf('.') + 1;

            urlObj.hostname = urlObj.hostname.substring(0, extnIndex) + replace;
            break;

        case 'port':
            urlObj.port = replace;
            break;

        case 'path':
            urlObj.pathname = replace;
            break;

        default:
            return replaceUserPath(urlObj, replace);
    }

    return urlObj.href;
}

function replaceUserPath(url, path) {
    /* eslint-disable no-template-curly-in-string */
    return path
        .replace('${protocol}', url.protocol)
        .replace('${username}', url.username)
        .replace('${password}', url.password)
        .replace('${host}', url.host)
        .replace('${hostname}', url.hostname)
        .replace('${port}', url.port)
        .replace('${path}', url.path)
        .replace('${query}', url.search);
}
