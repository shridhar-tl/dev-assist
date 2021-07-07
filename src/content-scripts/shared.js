import moment from 'moment';

export function getValue(obj, field) {
    if (!obj || !field) { return obj; }

    const index = field.indexOf('.');
    if (~index) {
        const value = obj[field.substring(0, index - 1)];
        return getValue(value, field.substring(index + 1));
    } else {
        return obj[field];
    }
}

export function getTypeName(value) {
    let type = typeof value;

    if (type === 'object') {
        if (value === null) { type = 'null'; }
        else if (Array.isArray(value)) { type = 'array'; }
        else if (value instanceof Date) { type = 'datetime'; }
    }

    return type;
}


export const allowedFuncInQuery = {
    gettype: getTypeName,
    now: function () { return new Date().getTime(); },
    today: function (endOfDay) {
        let value = moment();
        value = endOfDay ? value.endOf('day') : value.startOf('day');
        return value.valueOf();
    },
    getdate: function (value, dayStart) {
        const pattern = parsePattern(value);
        let date;
        if (pattern) {
            date = moment()
                .add(pattern.value, pattern.period);
        }
        else {
            date = moment(value);
        }

        if (dayStart === true) {
            date = date.startOf('day');
        } else if (dayStart === false) {
            date = date.endOf('day');
        }

        return date.valueOf();
    },
    lcase: function (value) { return (typeof value === 'string') ? value.toLowerCase() : value; },
    ucase: function (value) { return (typeof value === 'string') ? value.toUpperCase() : value; }
};

const patternCheck = /^(\+|-)(\d+)([A-z]+)$/i

function parsePattern(value) {
    if (!value || typeof value !== 'string') {
        return false;
    }

    const result = value.match(patternCheck);
    if (!result) { return false; }
    let period = result[3];

    if (period !== 'ms' && period !== 'm' && period !== 'M') {
        if (period.length > 1) {
            period = period.toLowerCase();
            if (!period.endsWith('s')) {
                period += 's';
            }
        } else if (period.toUpperCase() === 'Q') {
            period = 'Q';
        } else {
            period = period.toLowerCase();
        }
    }

    return {
        value: parseFloat(result[1] + result[2]),
        period
    };
}

export function parseValue(item, { value, field, func, params }) {
    if (value === undefined) {
        if (field === '*') {
            value = item;
        } else if (field) {
            value = getValue(item, field);
        } else if (func) {
            if (params) {
                params = params.map(param => parseValue(item, param));
            }

            value = allowedFuncInQuery[func].apply(null, params);
        }
    }

    if (value instanceof Date) {
        return value.getTime();
    }

    return value;
}