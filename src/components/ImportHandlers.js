import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';
import { Button } from '../controls';
import { clearImports, importSelection } from '../store/actions/handlers';

class ImportHandlers extends PureComponent {
    state = {};

    onHide = () => {
        this.setState({ selectedItems: null, selCount: 0 });
        this.props.clearImports();
    }

    importHandlers = () => {
        this.props.importSelection(this.getSelectedItems(), this.props.handlersMap);
        this.onHide();
    }

    getSelectedItems = () => this.state.selectedItems.map(({ id }) => id);

    handlerNameTemplate = (row, col) => (
        <>
            <span className="handler-name">
                {row.name}
                {!!row.exist && <span className="pi pi-exclamation-circle import-info warn" data-pr-tooltip="Handler already exists. Will be replaced if imported." />}
            </span>
            <span className="handler-desc">{row.desc}</span>
        </>
    );

    onSelectionChange = ({ value }) => this.setState({ selectedItems: value, selCount: value.length });

    render() {
        const { handlers } = this.props;
        const { selectedItems } = this.state;

        if (!handlers?.length) { return null; }

        const footer = <>
            <Button type="success" label={`Import ${selectedItems?.length || ''} Items`}
                disabled={!selectedItems?.length} onClick={this.importHandlers} />
            <Button type="secondary" label="Cancel" onClick={this.onHide} />
        </>;

        return (
            <Dialog header="Import handlers" visible={true}
                style={styles.dialog} footer={footer} onHide={this.onHide}>
                <Tooltip target=".import-info.warn" position="right" />
                <DataTable value={handlers} selection={selectedItems}
                    scrollable scrollHeight="400px" onSelectionChange={this.onSelectionChange}>
                    <Column selectionMode="multiple" style={styles.checkbox} />
                    <Column field="name" body={this.handlerNameTemplate} header="Handler"
                        className="handler-name-col" style={styles.name} />
                    <Column field="lastEdited" header="Last edited" style={styles.edited} />
                </DataTable>
            </Dialog>
        );
    }
}

const styles = ({
    dialog: { width: '65vw' },
    checkbox: { width: '40px' },
    edited: { width: '200px' }
});

export default connect(({ handlers: { importHandler } }) => {
    return importHandler || {};
}, { clearImports, importSelection })(ImportHandlers);