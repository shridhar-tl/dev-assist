/* eslint-disable default-case */
import { MessageType } from "../common/constants";
import { getIndexedDBList, getIndexDBData, bulkPutItems } from './idb-helper';

const chrome = window.chrome;

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    if (sender.id !== 'omjocblcimogflgejnnadnmbfmngblmd') {
        console.log('DA Error Code: 403', sender.id);
        return;
    }

    return processMessage(req, sendResponse);
});

export function processMessage({ type, request }, sendResponse) {
    switch (type) {
        case MessageType.Check:
            sendResponse({ result: true });
            break;
        case MessageType.ListIndexedDB:
            getIndexedDBList(request, sendResponse);
            return true;
        case MessageType.ListIndexDBData:
            getIndexDBData(request, sendResponse);
            return true;
        case MessageType.SaveIndexDBData:
            bulkPutItems(request, sendResponse);
            return true;
    }
}