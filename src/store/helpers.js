/* global chrome */

export function getObj(type, payload) { return { type, payload }; }

export function sendMessage(type = 'handlerEdited') {
    chrome.runtime.sendMessage({ type });
}
