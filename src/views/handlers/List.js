import React from 'react';
import { connect } from 'react-redux';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from '../../controls';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import BasePage from '../BasePage';
import * as actions from '../../store/actions/handlers';

class List extends BasePage {
    state = {}

    async componentDidMount() {
        await this.props.loadHandlersList();
    }

    onSelectionChange = ({ value }) => {
        this.setState({ selectedItems: value });
    }

    filterChanged = (e) => this.setState({ globalFilter: e.target.value })

    createHandler = () => this.props.history.push("/handlers/create");

    changeStatus({ id, enabled }) {
        this.props.updateStatus(id, !enabled);
    }

    editHandler(id) {
        this.props.history.push("/handlers/edit/" + id);
    }

    deleteHandlers(items) {
        // this.props.deleteItems(items);
    }

    optionsTemplate = (row, col) => {
        return <div>
            <Button type="button" icon="pi pi-pencil" className="p-button-success" style={{ marginRight: '.5em' }}
                onClick={() => this.editHandler(row.id)} />
            <Button type="button" icon="pi pi-pencil" className="p-button-danger" onClick={() => this.deleteHandlers(row.id)} />
            {/*<Button type="button" icon="fa fa-edit" />
            <Button type="button" icon="fa fa-trash" className="ui-button-danger" />*/}
        </div>;
    }

    statusTemplate = (row, col) => {
        return <InputSwitch checked={row.enabled} onChange={() => this.changeStatus(row)} />;
    }


    renderPage() {
        const { list } = this.props;

        return (
            <div>
                <Toolbar>
                    <div className="p-toolbar-group-left">
                        <h3><i className="fa fa-random"></i> List of Handlers</h3>
                    </div>
                    <div className="p-toolbar-group-right">
                        <InputText type="search" onInput={this.filterChanged} placeholder="Global Search" />

                        <Button label="New" icon="fa fa-plus" onClick={this.createHandler} />
                        <Button icon="fa fa-refresh" onClick={this.loadItems} />
                        <Button icon="fa fa-trash" className="ui-button-danger" onClick={this.deleteSelections} disabled={!this.state.selCount} />
                    </div>
                </Toolbar>
                <DataTable value={list} selection={this.state.selectedItems}
                    onSelectionChange={this.onSelectionChange}>
                    <Column selectionMode="multiple" style={columnStyles.checkbox} />
                    <Column field="name" header="Handler Name" />
                    <Column field="desc" header="Description" />
                    <Column body={this.statusTemplate} header="Status" style={columnStyles.status} />
                    <Column field="created" header="Created on" style={columnStyles.created} />
                    <Column field="modified" header="Modified on" style={columnStyles.modified} />
                    <Column body={this.optionsTemplate} header="Options" style={columnStyles.options} />
                </DataTable>
            </div>
        );
    }
}

const columnStyles = ({
    checkbox: { width: '40px' },
    status: { width: '120px' },
    created: { width: '160px' },
    modified: { width: '160px' },
    options: { width: '100px' },
});

export default connect(({ handlers: { list } }) => ({ list }), actions)(List);
