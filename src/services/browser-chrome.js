import { MessageType } from "../common/constants";

const controllableUrls = [
    'http://*/*', 'https://*/*',
    'chrome-extension://omjocblcimogflgejnnadnmbfmngblmd/*',
    'chrome-extension://momjbjbjpbcbnepbgkkiaofkgimihbii/*'
];

const chrome = window.chrome;
//https://github.com/mohsen1/json-formatter-js/blob/master/src/index.ts
class BrowserService {
    asyncMessages = {};
    constructor() {
        fetch('/entry-manifest.json')
            .then(res => res.json())
            .then(filesList => this.contentFilesList = filesList['cscript-chrome']);
    }

    getAllTabs = () => {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ url: controllableUrls }, function (result) {
                resolve(result.map(t => ({
                    id: t.id,
                    favIconUrl: t.favIconUrl,
                    index: t.index,
                    title: t.title,
                    windowId: t.windowId,
                    url: t.url
                })));
            });
        });
    }

    listenToMessages = () => {
        chrome.runtime.onMessage.addListener(
            function (request, sender, sendResponse) {
                if (request.async) {
                    const responder = this.asyncMessages[request.messageId];
                    if (responder) {
                        responder(request.response);
                    }
                }
                sendResponse({ done: true });
            }
        );
    }

    sendMessage = (tabId, type, request) => new Promise((resolve) => chrome.tabs.sendMessage(tabId, { type, request }, {}, resolve));

    injectContentScript = async (tabId) => {
        const response = await this.sendMessage(tabId, MessageType.Check);
        if (!response?.result) {
            await Promise.all(this.contentFilesList.map((file) => this.injectScript(tabId, file)));
        }
        return true;
    }

    injectScript = (tabId, file) => new Promise((resolve) => chrome.tabs.executeScript(tabId, { file }, resolve));

    requestData = async (tabId, type, request) => {
        await this.injectContentScript(tabId);
        return await this.sendMessage(tabId, type, request);

        /*if (response?.async) {
            this.asyncMessages[response.messageId] = resolve;
        } else {
        }*/
    }
}

export default BrowserService;