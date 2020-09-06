import { FilterTypes } from '../common/constants';
import { minsPerDay, getHostNameFromUrl, getHostInfoFromUrl } from '../common/common';
import { assertValue, validateQueryParam, getHeaderObj } from './helpers-common';

export function filterHandlersForRequest(request, list) {
    const {
        initiator, // Contains current domain name
        method, // GET, POST
        timeStamp,
        type, // script, image
        url,
        requestHeaders: headers,
        //parentFrameId, // numeric
    } = request;

    const requestHeaders = headers || [];

    return list.filter(({ filters, actions }) => {
        // If no filters are their, then apply this handler to this request
        if (!filters.length && actions.length) { return true; }

        function validateFilter(filters) {
            let isEligible = true;

            for (let i = 0; i < filters.length; i++) {
                const filter = filters[i];

                if (!isEligible && !filter.useOr) { break; }

                if (isEligible && filter.useOr) { break; }

                const { comparer, value } = filter;

                switch (filter.id) {
                    case FilterTypes.FilterGroup:
                        isEligible = validateFilter(filter.filters);
                        break;

                    case FilterTypes.Header:
                        const headerObj = getHeaderObj(requestHeaders, filter.key);
                        isEligible = assertValue(headerObj?.value, value, comparer);
                        break;

                    case FilterTypes.RequestType:
                        const { verbs, requestType, origin } = filter;

                        if (verbs?.length) {
                            isEligible = verbs.includes(method.toUpperCase());
                        }

                        // If current condtion is not satisfied, then do not check next condtion in current filter
                        if (!isEligible) {
                            continue;
                        }

                        if (requestType?.length) {
                            isEligible = requestType.includes(type.toLowerCase());
                        }

                        // If current condtion is not satisfied, then do not check next condtion in current filter
                        if (!isEligible || !origin || !origin.length) {
                            continue;
                        }

                        if (!initiator) {
                            isEligible = origin.includes('noorigin');
                            continue;
                        }

                        const hostInfo = getHostInfoFromUrl(url);
                        const initiatorHostInfo = getHostInfoFromUrl(initiator);

                        isEligible = (
                            (origin.includes('same') && hostInfo.host === initiatorHostInfo.host)
                            || (origin.includes('crossorigin') && hostInfo.host !== initiatorHostInfo.host)
                            || (
                                origin.includes('crosssubdomain')
                                && hostInfo.root === initiatorHostInfo.root
                                && hostInfo.port === initiator.port
                                && hostInfo.subdomain !== initiator.subdomain
                            )
                        );
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

                        isEligible = days.includes(dayOfWeek);
                        break;

                    case FilterTypes.TimeOfDay:
                        const { range: [start, end], excludeRange } = filter;

                        if (start === 0 && end === minsPerDay) {
                            isEligible = true;
                        }
                        else {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const minuteOfDay = (timeStamp - today.getTime()) / (1000 * 60);

                            isEligible = minuteOfDay >= start && minuteOfDay <= end;

                            if (excludeRange) {
                                isEligible = !isEligible;
                            }
                        }
                        break;

                    case FilterTypes.Attachment:
                        // ToDo: Yet to develop
                        break;

                    default: break;
                }
            }

            return isEligible;
        }

        return validateFilter(filters);
    });
}