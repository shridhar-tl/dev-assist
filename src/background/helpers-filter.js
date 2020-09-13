import { FilterTypes } from '../common/constants';
import { minsPerDay, getHostNameFromUrl, getHostInfoFromUrl, getBasicUrlInfo } from '../common/common';
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

    function validateFilter(filters) {
        let isEligible = true;

        for (let filter of filters) {
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

                case FilterTypes.RequestMethod:
                    isEligible = value.includes(method.toUpperCase());
                    break;

                case FilterTypes.RequestType:
                    isEligible = value.includes(type.toLowerCase());
                    break;

                case FilterTypes.RequestOrigin:
                    isEligible = validateRequestOrigin(initiator, value, url);
                    break;

                case FilterTypes.RequestProtocol:
                    const protocol = url.substring(0, url.indexOf(':')).toLowerCase();
                    isEligible = value.includes(protocol) ||
                        (value.includes('others') && !['http', 'https'].includes(protocol));
                    break;

                case FilterTypes.HostName:
                    const hostName = getHostNameFromUrl(url);

                    isEligible = assertValue(hostName, value, comparer);
                    break;

                case FilterTypes.RequestPort:
                    const { port } = getBasicUrlInfo(url);

                    isEligible = assertValue(port, value, comparer);
                    break;
                case FilterTypes.Initiator:
                    const initiatorHostName = getHostNameFromUrl(initiator);

                    isEligible = assertValue(initiatorHostName, value, comparer);
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

                default: break;
            }
        }

        return isEligible;
    }

    return list.filter(({ filters }) => {
        // If no filters are their, then apply this handler to this request
        if (!filters.length) { return true; }

        return validateFilter(filters);
    });
}

function validateRequestOrigin(initiator, value, url) {
    if (!initiator) {
        return value.includes('noorigin');
    }

    const hostInfo = getHostInfoFromUrl(url);
    const initiatorHostInfo = getHostInfoFromUrl(initiator);

    return (
        (value.includes('same') && hostInfo.host === initiatorHostInfo.host)
        || (value.includes('crossorigin') && hostInfo.host !== initiatorHostInfo.host)
        || (
            value.includes('crosssubdomain')
            && hostInfo.root === initiatorHostInfo.root
            && hostInfo.port === initiator.port
            && hostInfo.subdomain !== initiator.subdomain
        )
    );
}