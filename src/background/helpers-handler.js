import { extensionRootUrl } from './helpers-common';

export function canProcessRequest(requestData) {
    const { url } = requestData;

    // If the url trying to load is current extension url, then do not handle it
    if (url?.startsWith(extensionRootUrl)) {
        return false;
    }

    return true;
}