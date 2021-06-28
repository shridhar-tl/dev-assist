/* eslint-disable default-case */
import { getAssertScript } from "./helpers-common";
import { FilterTypes } from "../common/constants";

export function getPACScript(handlersForProxyOnly) {
    const script = handlersForProxyOnly.map(getScriptForHandler).join('\n\n');

    return (
        `function FindProxyForURL(url, hostname) {
    const today = new Date();
    const timeStamp = today.getTime();
    const dayOfWeek = today.getDay();
    today.setHours(0, 0, 0, 0);
    const minuteOfDay = (timeStamp - today.getTime()) / 60000;

    function validateQueryParam(key, singleValued, func) {
        const paramValues = Array.from(new URL(url).searchParams.entries())
        .filter(q => q[0].toLowerCase() === key).map(q => q[1]);

        if(paramValues.length > 1 && singleValued) { return false; }

        return values.some(func);
    }

    ${script}

    return 'SYSTEM';
}`);
}

function getScriptForHandler({ filters, actions }) {
    let script = getFiltersScript(filters);

    if (script) {
        script = `if ${script}\n`;
    }

    const { mode, value } = actions[0];

    return `${script}return '${getProxyConfig(mode, value)}';`;
}

export function getProxyConfig(mode, value) {
    switch (mode) {
        case 'direct': return "DIRECT";
        case 'fixed_servers': return `PROXY ${value}`;
        case 'system': return 'SYSTEM';
    }
}

function getFiltersScript(filters) {
    if (filters?.length) {
        return `(${filters.map(getFilterScript).join(' ').substring(3)})`;
    }

    return '';
}

function getFilterScript(filter) {
    const { key, value, comparer, useOr } = filter;
    let condition = null;

    switch (filter.id) {
        case FilterTypes.FilterGroup:
            condition = getFiltersScript(filter.filters);
            break;

        case FilterTypes.HostName:
            condition = getAssertScript('hostname', value, comparer);
            break;

        case FilterTypes.Url:
            condition = getAssertScript('url', value, comparer);
            break;

        case FilterTypes.QueryParam:
            condition = `validateQueryParam('${key.toLowerCase()}', ${filter.singleValued ? 'true' : 'false'}, (v) => ${getAssertScript('v', value, comparer)})`;
            break;

        case FilterTypes.TimeOfDay:
            const { range: [start, end], excludeRange } = filter;
            if (excludeRange) {
                condition = `minuteOfDay < ${start} && minuteOfDay > ${end}`;
            } else {
                condition = `minuteOfDay >= ${start} && minuteOfDay <= ${end}`;
            }
            break;

        case FilterTypes.DayOfWeek:
            condition = `[${filter.days}].includes(dayOfWeek)`;
            break;
    }

    return condition ? `${useOr ? '||' : '&&'} ${condition}` : ''
}