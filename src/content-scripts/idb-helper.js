import Dexie from 'dexie';
import { parseValue } from './shared';

export async function bulkPutItems(request, sendResponse) {
    const { tableName, dbName, items } = request;

    const db = await new Dexie(dbName).open();

    const table = db.table(tableName);

    await table.bulkPut(items);

    sendResponse(true);
}

export async function getIndexedDBList({ tabId }, sendResponse) {
    const dbList = await indexedDB.databases();
    const uri = new URL(document.location.href);
    const func = getIndexedDBTableList.bind({ host: uri.host, tabId });
    const result = await Promise.all(dbList.map(func));
    sendResponse(result);
}

async function getIndexedDBTableList({ name, version }) {
    const db = await new Dexie(name).open();
    const children = db.tables.map(getTableNode.bind({
        ...this,
        dbName: name
    }));

    return {
        key: name,
        ...this,
        dbName: name,
        leaf: false,
        icon: 'fa fa-database',
        label: `${name} (v${version})`,
        isDB: true,
        children
    };
}

function getTableNode(t) {
    const tableName = t.name;
    return ({
        key: tableName,
        label: tableName,
        ...this,
        tableName,
        icon: 'fa fa-table',
        isTable: true,
        leaf: true, // ToDo: If indexes are sent, then need to change it to false
        primKey: t.schema.primKey,
        /* Their is no real use in sending these index. Hence removed for now.
        children: t.schema.indexes.map(({ name, keyPath }) => ({
            leaf: true,
            isIndex: true,
            tableName,
            primKey: t.schema.primKey,
            icon: 'fa fa-key',
            key: name,
            label: name,
            keyPath: keyPath
        })) */
    });
}

export async function getIndexDBData(request, sendResponse) {
    const { tableName, maxRows, filter, dbName, start, host, tabId } = request;

    const db = await new Dexie(dbName).open();

    let table = db.table(tableName);
    let node = undefined;

    if (filter) {
        node = getTableNode.bind({ host, tabId, dbName })(table);
        table = table.filter(item => isMatching(item, filter));
    }

    const result = { total: await table.count(), node };
    result.items = await table.offset(start).limit(maxRows).toArray();

    sendResponse(result);
}

function isMatching(item, filter, prev) {
    if (!filter) { return false; }
    const { operator } = filter;

    // If operator exists, then its a filter condition
    if (operator) {
        const { left, right } = filter;

        const leftValue = parseValue(item, left);
        const rightValue = parseValue(item, right);

        switch (operator) {
            case '=': return leftValue === rightValue;
            case '!=': return leftValue !== rightValue;
            case '>': return leftValue > rightValue;
            case '>=': return leftValue >= rightValue;
            case '<': return leftValue < rightValue;
            case '<=': return leftValue <= rightValue;
            case 'in': return rightValue.includes(leftValue);
            case 'not': return !rightValue.includes(leftValue);
            default: return false;
        }
    } else {
        const { and, or } = filter;
        const matchAll = !!and;

        return (and || or).reduce((res, cur) => {
            // When or condition and previous result is true, or
            // when and condition and previous is false,
            // just return previous result
            if ((!matchAll && res) || (matchAll && !res)) {
                return res;
            }

            return isMatching(item, cur, res);
        }, prev === undefined ? matchAll : prev);
    }
}