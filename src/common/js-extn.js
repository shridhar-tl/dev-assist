/*eslint-disable no-extend-native, no-loop-func*/

const arrayInitFunc = (function () {
    const arrayFunc = function arrayFunc(array) {
        if (!array) {
            throw new Error("No input received. Expected an array.");
        }
        let source = array;

        if (typeof source === "number") {
            source = new Array(source);
        }

        const prototype = function () {
            return source;
        };

        // Aggregate functions mapping
        mapToProto(prototype, aggrExtns, aggrFuncs, aggrFuncCount, false);

        // Array returning functions mapping
        mapToProto(prototype, arrExtns, arrFuncs, arrFuncCount, true);

        function mapToProto(proto, funcObj, funcList, len, isArrFunc) {
            if (isArrFunc) {
                for (let i = 0; i < len; i++) {
                    const key = funcList[i];

                    proto[key] = function () {
                        source = funcObj[key].apply(source, arguments);
                        return prototype;
                    }
                }
            }
            else {
                for (let i = 0; i < len; i++) {
                    const key = funcList[i];

                    proto[key] = function () {
                        return funcObj[key].apply(source, arguments);
                    }
                }
            }
        }

        return prototype;
    };


    arrayFunc.from = function (obj) {
        return arrayFunc(Array.from(obj));
    };
    //arrayFunc.cloneFrom = function (obj, deep) { return arrayFunc(Array.from(obj)); }


    const arrExtns = {
        take: function (count) {
            const result = [];
            for (let i = 0; i < this.length && i < count; i++) {
                result.push(this[i]);
            }
            return result;
        },
        sortBy: function (clause, desc) {
            clause = parseClause(clause);
            return desc ? arrExtns.orderByDescending.call(this, clause) : arrExtns.orderBy.call(this, clause);
        },
        orderBy: function (clause) {
            const tempArray = cloneArray(this);

            return tempArray.sort(function (a, b) {
                const x = prepareForSort(clause ? clause(a) : a);
                const y = prepareForSort(clause ? clause(b) : b);

                if (!x && y) { return -1; }
                else if (x && !y) { return 1; }
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        },
        orderByDescending: function (clause) {
            const tempArray = cloneArray(this);

            return tempArray.sort(function (a, b) {
                const x = prepareForSort(clause ? clause(b) : b);
                const y = prepareForSort(clause ? clause(a) : a);

                if (!x && y) { return -1; }
                else if (x && !y) { return 1; }
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            });
        },
        groupBy: function (clause, filter) {
            const result = [];
            const valObj = {};
            clause = parseClause(clause);

            for (let i = 0; i < this.length; i++) {
                const item = this[i];
                const key = clause(item);
                let keyStr = null;
                if (typeof key === "object") { keyStr = JSON.stringify(key); }
                let obj = valObj[keyStr || key];
                if (!obj) {
                    obj = { key: key, values: [] };
                    result.push(valObj[keyStr || key] = obj);
                }
                if (!filter || filter(item)) {
                    obj.values.push(item);
                }
            }
            return result;
        }
    };

    const arrFuncs = Object.keys(arrExtns);
    const arrFuncCount = arrFuncs.length;

    const aggrExtns = {
        sum: function (clause) {
            clause = parseClause(clause);
            let value = 0, index;
            if (clause) {
                for (index = 0; index < this.length; index++) {
                    value += clause(this[index]) || 0;
                }
            } else {
                for (index = 0; index < this.length; index++) {
                    value += parseFloat(this[index]) || 0;
                }
            }
            return value;
        },
        firstIndexOf: function (predicate) {
            for (let index = 0; index < this.length; index++) {
                if (predicate(this[index], index)) {
                    return index;
                }
            }
            return -1;
        }
    };

    const aggrFuncs = Object.keys(aggrExtns);
    const aggrFuncCount = aggrFuncs.length;

    return arrayFunc;
})();
export default arrayInitFunc;

export function getObjVal(row, prop) {
    if (typeof prop === "string") {
        var split = prop.split(".");
        var value = row[split[0]];
        for (var j = 1; value && j < split.length; j++) {
            value = value[split[j]];
        }
        return value;
    } else if (typeof prop === "function") {
        return prop(row);
    }
}

export function clone(obj, deep) {
    if (Array.isArray(obj)) {
        return cloneArray(obj, deep);
    } else if (obj instanceof Date) {
        return new Date(obj.getTime());
    } else if (typeof obj === "object") {
        return cloneObject(obj, deep);
    } else {
        return obj;
    }
}

export function cloneArray(array, deep) {
    if (!array) {
        return array;
    }
    let len = array.length;
    const result = [];
    if (deep) {
        while (len--) {
            result[len] = clone(array[len], deep);
        }
    } else {
        while (len--) {
            result[len] = array[len];
        }
    }
    return result;
}

export function cloneObject(obj, deep) {
    if (!obj) {
        return obj;
    }
    if (deep) {
        var result = {};
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                result[prop] = clone(obj[prop], true);
            }
        }
        return result;
    } else {
        return { ...obj };
    }
}

function prepareForSort(data) {
    return (data instanceof Date) ? data.getTime() : data;
}

function parseClause(clause) {
    if (typeof clause === 'string') {
        clause = clause.trim();
        if (!~clause.indexOf('.')) {
            return function (obj) { return obj[clause]; }
        }
        else {
            return function (obj) { return getObjVal(obj, clause); }
        }
    }
    return clause;
}