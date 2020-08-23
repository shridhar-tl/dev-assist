import { ActionModifyItemType } from './constants';

export function parseCookie(cookie) {
    cookie = cookie.trim().split(';');
    cookie = cookie.reduce((obj, cur) => {
        if (!cur) { return obj; }

        cur = cur.split('=');
        obj[cur[0].trim()] = obj[1].trim();

        return obj;
    }, {});

    return cookie
}

export function changeHeader(header, value, requestHeaders, headerActionType) {

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

export function setCookie(name, value, cookies, actionType) {
    const keyMap = Object.keys(cookies).map(c => ({ [c.toUpperCase()]: c }));

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

export function replaceUrl(url, find, replace) {
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
            urlObj.path = replace;
            break;

        default:
            return replaceUserPath(urlObj, replace);
    }

    return urlObj.href;
}

function replaceUserPath(url, path) {
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
