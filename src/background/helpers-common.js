/* global chrome */
import { matchWildcard } from '../common/common';

export const extensionRootUrl = chrome.extension.getURL('/');

export function assertValue(actual, expected, comparer) {
    actual = actual?.toLowerCase() || '';

    if (typeof expected === 'string') { expected = expected.toLowerCase(); }
    else if (Array.isArray(expected)) { expected = expected.map(e => e.toLowerCase()); }
    //is none of
    // contains none of
    switch (comparer) {
        default: return actual === expected;
        case '!==': return actual !== expected;
        case '%': return actual.indexOf(expected) >= 0; // contains
        case '!%': return actual.indexOf(expected) === -1; // does not contain
        case '[]': return expected.indexOf(actual) >= 0; // is any of
        case '[!]': return expected.indexOf(actual) === -1; // is none of
        case '[%]': return expected.some(v => actual.indexOf(v) >= 0); // contains any of
        case '[!%]': return !expected.some(v => actual.indexOf(v) >= 0); // contains none of
        case '~_': return actual.startsWith(expected); // starts with
        case '_~': return actual.endsWith(expected); // ends with
        case '[~_]': return expected.some(v => actual.startsWith(v)); // starts with any of
        case '[_~]': return expected.some(v => actual.endsWith(v)); // ends with any of
        //case '=': return !!actual;
        //case '!': return !actual;
        case '*': return !!actual; // has some value
        case '-': return !actual; // is empty
        case '$': return new RegExp(expected).test(actual); // regex match
        case '$*': return matchWildcard(actual, expected);  // match wildcard
    }
}

export function getAssertScript(actual, value, comparer) {
    const expected = JSON.stringify(value);

    switch (comparer) {
        default: return `${actual} === ${expected}`;
        case '!==': return `${actual} !== ${expected}`;
        case '%': return `${actual}.indexOf(${expected}) >= 0`;
        case '!%': return `${actual}.indexOf(${expected}) === -1`;
        case '[]': return `${expected}.indexOf(${actual}) >= 0`;
        case '[!]': return `${expected}.indexOf(${actual}) === -1`;
        case '[%]': return `${expected}.some(v => ${actual}.indexOf(v) >= 0)`;
        case '[!%]': return `!${expected}.some(v => ${actual}.indexOf(v) >= 0)`;
        case '~_': return `${actual}.startsWith(${expected})`;
        case '_~': return `${actual}.endsWith(${expected})`;
        case '[~_]': return `${expected}.some(v => ${actual}.startsWith(v))`;
        case '[_~]': return `${expected}.some(v => ${actual}.endsWith(v))`;
        //case '=': return !!actual;
        //case '!': return !actual;
        case '*': return `!!${actual}`;
        case '-': return `!${actual}`;
        case '$': return `new RegExp(${expected}).test(${actual})`;
        case '$*': return `matchWildcard(${actual}, ${expected})`;
    }
}

export function validateQueryParam(url, filters) { // ToDo:
    const { key, comparer, value, singleValued } = filters;
    const keyToLower = key?.toLowerCase();

    let values = Array.from(new URL(url).searchParams.entries())
        .filter(q => q[0].toLowerCase() === keyToLower)
        .map(q => q[1]);

    if (values.length > 1 && singleValued) {
        return false;
    }

    return values.some(v => assertValue(v, value, comparer));
}

export function getHeaderObj(headers, key) {
    const keyToUpper = key.toUpperCase();

    return headers.find(h => h.name.toUpperCase() === keyToUpper);
}