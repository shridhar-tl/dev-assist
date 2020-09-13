import React from 'react';
import { connect } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from '../../controls';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { FileUpload } from 'primereact/fileupload';
import BasePage from '../BasePage';
import * as actions from '../../store/actions/handlers';
import { confirm, hide } from '../../common/toast';
import { ConfirmContent } from '../../components';
import './List.scss';

const noHandlersMessage = 'No handlers exists. Click on "New" button to create a new handler.';

const tooltipLeft = { position: 'left' };
const tooltipLeftOnFocus = { position: 'left', event: 'focus' };

class List extends BasePage {
    state = { globalFilter: '' }

    async componentDidMount() {
        await this.props.loadHandlersList();
    }

    onSelectionChange = ({ value }) => this.setState({ selectedItems: value, selCount: value?.length || null });

    filterChanged = (e) => this.setState({ globalFilter: e.target.value })

    createHandler = () => this.props.history.push("/handlers/create");

    changeStatus = ({ id, enabled }) => this.props.updateStatus(id, !enabled);

    editHandler = (id) => this.props.history.push("/handlers/edit/" + id);

    deleteSelections = () => this.deleteHandlers(this.getSelectedItems());

    getSelectedItems = () => this.state.selectedItems.map(({ id }) => id);

    deleteHandlers = (items) => {
        confirm(<ConfirmContent
            onConfirm={() => {
                this.props.deleteHandlers(items);
                this.onSelectionChange({ value: null });
                hide();
            }}
            text="Are you sure to delete?"
            note={Array.isArray(items) ? `Confirm to delete ${items.length} handler(s)` : 'Confirm to delete selected handler'}
        />);
    }

    statusTemplate = (row, col) => (<InputSwitch checked={row.enabled}
        onChange={() => this.changeStatus(row)}
        tooltip={`Click to ${row.enabled ? "disable" : "enable"} this handler`}
        tooltipOptions={tooltipLeft} />);

    optionsTemplate = (row, col) => (
        <div>
            {/*<Button icon="pi pi-copy" type="primary" style={{ marginRight: '.5em' }}
                tooltip="Click to copy this handler" tooltipOptions={tooltipLeft} />*/}
            <Button icon="fas fa-trash" type="danger" onClick={() => this.deleteHandlers(row.id)}
                tooltip="Click to delete this handler" tooltipOptions={tooltipLeft} />
        </div>
    );

    handlerNameTemplate = (row, col) => (
        <>
            <span className="handler-name clickable" onClick={() => this.editHandler(row.id)}
                title="Click to edit this Handler">{row.name}</span>
            <span className="handler-desc">{row.desc}</span>
        </>
    );

    downloadSelection = () => {
        this.props.downloadHandlers(this.getSelectedItems());
        this.onSelectionChange({ value: null });
    }

    onFileSelected = ({ files: [file] }) => {
        const reader = new FileReader();
        reader.onload = ({ target: { result } = {} }) => {
            this.fileUploader.clear();
            this.props.importHandlers(result);
        };
        reader.readAsBinaryString(file);
    }

    setUploader = (e) => this.fileUploader = e;

    renderPage() {
        const { list } = this.props;
        const { globalFilter, selCount } = this.state;

        const left = (<h3 className="handler-list-title"><i className="fa fa-random"></i> List of Handlers</h3>);
        const right = (<>
            <InputText type="search" onInput={this.filterChanged} placeholder="Global Search"
                tooltip="Type to filter handler" tooltipOptions={tooltipLeftOnFocus} />

            <Button label="New" icon="fa fa-plus" onClick={this.createHandler}
                type="success" tooltip="Click to create new handler" tooltipOptions={tooltipLeft} />
            <FileUpload ref={this.setUploader} mode="basic" accept="*.dah" maxFileSize={30000} customUpload={true}
                chooseLabel="Import" onSelect={this.onFileSelected}
                tooltip="Choose file to import handlers" tooltipOptions={tooltipLeft} />
            <Button icon="pi pi-download" onClick={this.downloadSelection} disabled={!selCount}
                tooltip="Export selected handlers" tooltipOptions={tooltipLeft} />
            <Button icon="fas fa-sync-alt" onClick={this.loadItems}
                tooltip="Refresh handlers list" tooltipOptions={tooltipLeft} />
            <Button icon="fa fa-trash" type="danger" onClick={this.deleteSelections} disabled={!selCount}
                tooltip="Click to delete selected handlers" tooltipOptions={tooltipLeft} />
        </>);

        return (
            <div>
                <Toolbar left={left} right={right} />
                <DataTable value={list} selection={this.state.selectedItems}
                    emptyMessage={noHandlersMessage} globalFilter={globalFilter}
                    onSelectionChange={this.onSelectionChange}>
                    <Column selectionMode="multiple" style={columnStyles.checkbox} />
                    <Column field="name" body={this.handlerNameTemplate} header="Handler"
                        className="handler-name-col" style={columnStyles.name} />
                    <Column body={this.statusTemplate} header="Status" style={columnStyles.status} />
                    <Column field="created" header="Created on" style={columnStyles.created} />
                    <Column field="modified" header="Last Modified" style={columnStyles.modified} />
                    <Column field="desc" body={this.optionsTemplate} header="Options" style={columnStyles.options} />
                </DataTable>
            </div>
        );
    }
}

const columnStyles = ({
    checkbox: { width: '40px' },
    status: { width: '70px' },
    created: { width: '200px' },
    modified: { width: '200px' },
    options: { width: '130px' },
});

export default connect(({ handlers: { list } }) => ({ list }), actions)(List);
