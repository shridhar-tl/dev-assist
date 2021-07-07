import React from 'react';
import { JSONEditor } from 'reactjs-json-editor';
import { Message } from 'primereact/message';
import { Tree } from 'primereact/tree';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import BrowserService from '../../services/browser-chrome';
import BasePage from '../BasePage';
import { MessageType } from '../../common/constants';
import QueryEditor from '../../components/QueryEditor';
import { getTypeName, parseValue } from '../../content-scripts/shared';
import { idbInfoMessage } from './helpinfo';
import {
    getSiteNodes,
    paginatorTemplate,
    rowsPerPageOptions,
    currentPageReportTemplate
} from './helper';
import 'reactjs-json-editor/css/style.css';
import './Common.scss';
import { processMessage } from '../../content-scripts/chrome';

class IndexedDB extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            rowsPerPage: 10, rowStartIndex: 0,
            modifiedItems: {}
        };
        this.$browser = new BrowserService();
    }

    async componentDidMount() {
        const nodes = await getSiteNodes(this.$browser);

        this.setState({ nodes });
    }

    requestData = async (node, type, request) => {
        if ((node.host || node.key) === 'omjocblcimogflgejnnadnmbfmngblmd') {
            return new Promise(resolve => processMessage({ type, request }, resolve));
        } else {
            return await this.$browser.requestData(node.tabId || node.id, type, request);
        }
    }

    loadOnExpand = async ({ node }) => {
        if (node.children) {
            return;
        }

        this.setState({ loadingNodes: true });
        node.children = await this.requestData(
            node,
            MessageType.ListIndexedDB,
            {
                tabId: node.id
            }
        );
        this.setState({ loadingNodes: false });
    }

    onSelect = ({ node }) => {
        if (!(node.isDB || node.isIndex || node.isTable)) {
            return;
        }

        const tableName = node.isDB ? node.children[0].tableName : node.tableName;

        const sql = `select * from ${tableName} limit ${this.state.rowsPerPage}`;

        this.setClearState({
            selectedNode: node,
            rowStartIndex: 0,
            query: null,
            sql
        }, node.isDB ? undefined : this.loadData);
    }

    loadData = async () => {
        const { selectedNode: node, query } = this.state;
        const { tabId, host, } = node;
        const { tableName, filter, select } = query || node;

        this.setState({
            loadingItems: true,
            query,
            modifiedItems: null,
            queryError: null
        });

        const { rowsPerPage: maxRows, rowStartIndex } = this.state;

        let { total, items, node: newNode } = await this.requestData(
            node,
            MessageType.ListIndexDBData,
            {
                // tabId and host are required to generate the new node again in case for query
                tabId, host,
                tableName, filter, maxRows,
                dbName: node.dbName,
                start: rowStartIndex
            }
        );
        const selectedNode = newNode || node;
        const { primKey: { keyPath } } = selectedNode;

        items = items.map(item => ({ __DA_KEY__: this.getItemKey(item, keyPath), __DA_VALUE__: item }));
        const itemsRowMap = items.reduce((map, cur, i) => {
            map[cur.__DA_KEY__] = i;
            return map;
        }, {});

        // Prepare data for display
        if (select) {
            items.forEach(this.prepareDataForSelectFields(select));
        }

        this.setState({
            loadingItems: false,
            totalRecords: total,
            itemsRowMap,
            items,
            selectedNode
        });
    }

    prepareDataForSelectFields(select) {
        return item => {
            select?.forEach((f) => {
                item[f.colId] = parseValue(item.__DA_VALUE__, f);
            });

            return item;
        };
    }

    onDataChanged = (value, key) => {
        let { modifiedItems, items, itemsRowMap, query } = this.state;

        modifiedItems = modifiedItems ? { ...modifiedItems } : {};
        modifiedItems[key] = true;

        const idx = itemsRowMap[key];
        items = [...items];
        items[idx] = this.prepareDataForSelectFields(query?.select)({ __DA_KEY__: key, __DA_VALUE__: value });

        this.setState({ items, modifiedItems });
    }

    saveChanges = async () => {
        let { modifiedItems, items, itemsRowMap, selectedNode, selectedNode: { dbName, tableName } } = this.state;

        if (!modifiedItems) {
            return;
        }

        const objectsToSave = Object.keys(modifiedItems).map(key => items[itemsRowMap[key]].__DA_VALUE__);

        await this.requestData(
            selectedNode, MessageType.SaveIndexDBData,
            { dbName, tableName, items: objectsToSave }
        );

        this.loadData();
    }

    pullPageData = ({ first, page, rows }) => {
        this.setState({ rowStartIndex: first, pageNo: page, rowsPerPage: rows }, this.loadData);
    }

    executeQuery = ({ maxRows: rowsPerPage, ...query }) => {
        if (!rowsPerPage) {
            rowsPerPage = this.state.rowsPerPage;
        }

        query.select?.forEach((c, i) => {
            const { field } = c;

            if (field === '*') {
                c.colId = '__DA_VALUE__';
                if (!c.alias) {
                    c.alias = '[Original Value]'
                }
            }
            else {
                c.colId = field || '[Column: ' + (i + 1) + ']';
            }
        });

        this.setClearState({ rowsPerPage, query }, this.loadData);
    }

    setClearState = (newState, callback) => {
        this.setState({
            loadingItems: false,
            query: null,
            queryError: null,
            items: null,
            modifiedItems: null,
            itemsRowMap: null,
            totalRecords: null,
            ...newState
        }, callback);
    }

    onQueryError = ({ message }) => this.setClearState({ queryError: message.split('\n') });

    getItemKey = (item, keyPath) => {
        if (Array.isArray(keyPath)) {
            return JSON.stringify(keyPath.map(k => item[k]));
        }
        const key = item[keyPath];
        const keyType = typeof key;
        return keyType === 'string' || keyType === 'number' ? key : JSON.stringify(key);
    }

    getRowClassName = ({ __DA_KEY__ }) => ({ 'data-modified': !!this.state.modifiedItems?.[__DA_KEY__] });

    jsonEditorTemplate = (item) => (<JSONEditor args={item.__DA_KEY__} value={item.__DA_VALUE__} onChange={this.onDataChanged} />);

    columnTemplate = (field) => {
        if (field === '__DA_VALUE__') {
            return this.jsonEditorTemplate;
        }

        return (row) => {
            const value = row[field];
            const type = getTypeName(value);

            switch (type) {
                case 'object': case 'array':
                    return <JSONEditor field={field} value={value} onChange={null} />
                case 'datetime':
                    return JSON.stringify(value);
                case 'undefined': case 'null':
                    return type;
                default:
                    return value.toString();
            }
        }
    }

    render() {
        const {
            nodes, loadingNodes, items, modifiedItems,
            loadingItems, rowsPerPage, totalRecords,
            sql, query, selectedNode, queryError, rowStartIndex
        } = this.state;

        const keyName = selectedNode?.primKey?.name;

        const select = query?.select;
        const paginatorRight = !!modifiedItems && <Button type="button" icon="fa fa-check"
            className="p-button-text p-button-success" label="Save" onClick={this.saveChanges}
        />;

        return (
            <div className="page-storage idb">
                <Splitter style={{ height: 'calc(100vh - 118px)' }}>
                    <SplitterPanel size={20}>
                        <Splitter layout="vertical" style={{ height: '100%' }}>
                            <SplitterPanel size={70} minSize={40}>
                                <div className="tree-container">
                                    <Tree value={nodes} className="p-tree-sm"
                                        selectionMode="single"
                                        loading={loadingNodes}
                                        onExpand={this.loadOnExpand}
                                        onSelect={this.onSelect}
                                    />
                                </div>
                            </SplitterPanel>
                            <SplitterPanel size={30} minSize={30}>
                                <QueryEditor sql={sql}
                                    onExecute={this.executeQuery}
                                    onError={this.onQueryError}
                                    disabled={!selectedNode?.dbName}
                                />
                            </SplitterPanel>
                        </Splitter>
                    </SplitterPanel>
                    <SplitterPanel size={80} minSize={60}>
                        {!!queryError && <div className="p-col-12">
                            <Message severity="error" text={queryError.map((line, i) => <span key={i}>{line}<br /></span>)} />
                        </div>}
                        {!items && !loadingItems && idbInfoMessage}
                        {items?.length === 0 && !loadingItems && <div className="p-col-12">
                            <Message severity="info" text="No records exists" />
                        </div>}
                        {(items?.length > 0 || loadingItems) &&
                            <DataTable value={items} paginator scrollable loading={loadingItems} className="p-datatable-sm"
                                onPage={this.pullPageData} totalRecords={totalRecords} lazy first={rowStartIndex}
                                paginatorTemplate={paginatorTemplate}
                                currentPageReportTemplate={currentPageReportTemplate}
                                rows={rowsPerPage} rowsPerPageOptions={rowsPerPageOptions}
                                paginatorRight={paginatorRight}
                                rowClassName={this.getRowClassName}
                                scrollHeight="calc(100vh - 224px)"
                            >
                                {!!select && select.map(({ colId, alias }) => <Column
                                    field={colId} header={alias || colId}
                                    body={this.columnTemplate(colId)}
                                    headerClassName={"col-dynamic" + (colId === '__DA_VALUE__' ? '-value' : '')}
                                    bodyClassName={"col-dynamic" + (colId === '__DA_VALUE__' ? '-value' : '')}
                                />)}
                                {!select && <Column field="__DA_KEY__" header={"Key (" + keyName + ")"}
                                    headerClassName="col-key"
                                    bodyClassName="col-key"
                                />}
                                {!select && <Column field="__DA_VALUE__" header="Value" body={this.jsonEditorTemplate}
                                    headerClassName="col-value"
                                    bodyClassName="col-value"
                                />}
                            </DataTable>}
                    </SplitterPanel>
                </Splitter>
            </div>
        );
    }
}

export default IndexedDB;

