import './extensions';
import { tripleDigitNonDomainNames, doubleDigitNonDomainNames } from './constants';

export const minsPerDay = (24 * 60);

export function convertToTime(mins) {
    const date = new Date();
    date.setHours(0, mins, 0, 0);

    return date;
}

export const UUID = (function () {
    const self = {};
    const lut = [];

    for (let i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }

    self.generate = function () {
        const d0 = Math.random() * 0xffffffff | 0;
        const d1 = Math.random() * 0xffffffff | 0;
        const d2 = Math.random() * 0xffffffff | 0;
        const d3 = Math.random() * 0xffffffff | 0;

        return `${lut[d0 & 0xff] + lut[(d0 >> 8) & 0xff] + lut[(d0 >> 16) & 0xff] + lut[(d0 >> 24) & 0xff]}-${
            lut[d1 & 0xff]}${lut[(d1 >> 8) & 0xff]}-${lut[((d1 >> 16) & 0x0f) | 0x40]}${lut[(d1 >> 24) & 0xff]}-${
            lut[(d2 & 0x3f) | 0x80]}${lut[(d2 >> 8) & 0xff]}-${lut[(d2 >> 16) & 0xff]}${lut[(d2 >> 24) & 0xff]
            }${lut[d3 & 0xff]}${lut[(d3 >> 8) & 0xff]}${lut[(d3 >> 16) & 0xff]}${lut[(d3 >> 24) & 0xff]}`;
    };

    return self;
})();

export function matchWildcard(str, rule) {
    // for this solution to work on any string, no matter what characters it has
    var escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");

    // "."  => Find a single character, except newline or line terminator
    // ".*" => Matches any string that contains zero or more characters
    rule = rule.split("*").map(escapeRegex).join(".*");

    // "^"  => Matches any string with the following at the beginning of it
    // "$"  => Matches any string with that in front at the end of it
    rule = "^" + rule + "$"

    //Create a regular expression object for matching string
    var regex = new RegExp(rule);

    //Returns true if it finds a match, otherwise it returns false
    return regex.test(str);
}

export function getHostNameFromUrl(url) {
    return new URL(url).hostname;
}

export function getHostInfoFromUrl(url) {
    if (!url) { return {}; }

    const urlObj = new URL(url);
    const { host, hostname, port, protocol, pathname } = urlObj;

    const result = { host, hostname, port, protocol, pathname };

    const parts = hostname.split('.');
    const partLen = parts.length;

    if (partLen > 2) {
        const secondPart = parts[partLen - 2];
        let doubleDotted = false;

        if (secondPart.length === 3) {
            doubleDotted = tripleDigitNonDomainNames.includes(secondPart);
        } else if (secondPart.length === 2) {
            doubleDotted = doubleDigitNonDomainNames.includes(secondPart);
        }

        result.isDblDotExtn = doubleDotted;

        const rootDomainLen = (doubleDotted ? 3 : 2);
        const subDomainLength = partLen - rootDomainLen;

        result.subdomain = parts.slice(0, subDomainLength).join('.');
        result.root = parts.slice(subDomainLength).join('.');
        result.extension = parts.slice(partLen - (doubleDotted ? 2 : 1)).join('.');
    }
    else if (partLen === 1) {
        result.subdomain = '';
        result.root = hostname;
        result.extension = '';
    }
    else {
        result.subdomain = '';
        result.root = hostname;
        result.extension = parts[partLen - 1];
    }

    return result;
}
