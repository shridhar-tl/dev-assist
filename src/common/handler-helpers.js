import { initStore } from '../store';
import { loadActiveHandlers } from '../store/actions/handlers';
import { FilterTypes } from './constants';
import { minsPerDay, matchWildcard } from './common';

export const store = initStore();
let handlersUsingHeaders = [];
let handlersNotUsingHeaders = [];

// When the store is updated, get the active handlers list from store
store.subscribe(() => {
    handlersUsingHeaders = store.getState().handlers?.handlersUsingHeaders || [];
    handlersNotUsingHeaders = store.getState().handlers?.handlersNotUsingHeaders || [];
});

refreshHandlers();

// This function will refresh the store with active handlers list data from db
export function refreshHandlers() {
    loadActiveHandlers()(store.dispatch);
}

function getHostNameFromUrl(url) {
    return new URL(url).hostname;
}

function assertValue(actual, expected, comparer) {
    actual = actual.toLowerCase();

    if (typeof expected === 'string') { expected = expected.toLowerCase(); }
    else if (Array.isArray(expected)) { expected = expected.map(e => e.toLowerCase()); }

    switch (comparer) {
        case '===': return actual === expected;
        case '!==': return actual !== expected;
        case '%': return actual.indexOf(expected) >= 0;
        case '[]': return expected.indexOf(actual) >= 0;
        case '[%]': return expected.some(v => actual.indexOf(v) >= 0);
        case '~_': return actual.startsWith(expected);
        case '_~': return actual.endsWith(expected);
        case '[~_]': return expected.some(v => actual.startsWith(v));
        case '[_~]': return expected.some(v => actual.endsWith(v));
        //case '=': return !!actual;
        //case '!': return !actual;
        case '*': return !!actual;
        case '-': return !actual;
        case '$': return new RegExp(expected).test(actual);
        case '$*': return matchWildcard(actual, expected);
    }
}

function validateQueryParam(url, filters) { // ToDo:
    const { key, comparer, value } = filters;
}

export function getApplicableHandlers(requestData, preRequest) {
    const {
        initiator, // Contains current domain name
        method, // GET, POST
        timeStamp,
        type, // script, image
        url,
        requestHeaders,
        //parentFrameId, // numeric
    } = requestData;

    const list = preRequest ? handlersNotUsingHeaders : handlersUsingHeaders;

    return list.filter(({ filters, actions }) => {
        // If no filters are their, then apply this handler to this request
        if (!filters.length && actions.length) { return true; }

        function validateFilter(filters) {
            let isEligible = true;

            for (let i = 0; i < filters.length; i++) {
                const filter = filters[i];

                if (!isEligible && !filter.useOr) { break; }

                if (isEligible && filter.useOr) { break; } // Need to check if or can be handled this way

                const { comparer, value } = filter;

                switch (filter.id) {
                    case FilterTypes.FilterGroup:
                        isEligible = validateFilter(filter.filters);
                        break;

                    case FilterTypes.FilterGroup:
                        // ToDo:
                        break;

                    case FilterTypes.RequestType:
                        const { verbs, initiator: selInitiator } = filter;

                        if (verbs?.length) {
                            const curMethod = method.toUpperCase();
                            isEligible = verbs.includes(curMethod);

                            // If current condtion is not satisfied, then do not check next condtion in current filter
                            if (!isEligible) {
                                continue;
                            }
                        }

                        if (initiator?.length) {
                            const curInitiator = type.toLowerCase();
                            isEligible = selInitiator.includes(curInitiator);
                        }
                        break;

                    case FilterTypes.HostName:
                        const hostName = getHostNameFromUrl(url);

                        isEligible = assertValue(hostName, value, comparer);
                        break;

                    case FilterTypes.Url:
                        isEligible = assertValue(url, value, comparer);
                        break;

                    case FilterTypes.ReferrerUrl:
                        const referrerObj = getHeaderObj(requestHeaders, 'Referrer');
                        isEligible = assertValue(referrerObj?.value, value, comparer);
                        break;

                    case FilterTypes.QueryParam:
                        isEligible = validateQueryParam(url, filter);
                        break;

                    case FilterTypes.DayOfWeek:
                        const dayOfWeek = new Date(timeStamp).getDay();
                        const { days } = filter;

                        isEligible = days?.includes(dayOfWeek);
                        break;

                    case FilterTypes.TimeOfDay:
                        const { range: [start, end] } = filter;

                        if (start === 0 && end === minsPerDay) {
                            isEligible = true;
                        }
                        else {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const minuteOfDay = (timeStamp - today.getTime()) / (1000 * 60);
                            isEligible = minuteOfDay > start && minuteOfDay < end;
                        }
                        break;

                    case FilterTypes.Attachment:
                        // ToDo: Yet to develop
                        break;
                }
            }

            return isEligible;
        }

        return validateFilter(filters);
    });
}

export function getHeaderObj(headers, key) {
    const keyToUpper = key.toUpperCase();

    return headers.find(h => h.name.toUpperCase() === keyToUpper);
}
