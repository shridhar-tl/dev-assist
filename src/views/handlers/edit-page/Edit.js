import React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from '../../../controls';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import BasePage from '../../BasePage';
import Controls from './Controls';
import Builder from './Builder';
import { InputText } from 'primereact/components/inputtext/InputText';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/handlers';
import './Edit.scss';

class Edit extends BasePage {
    state = {
        id: null,
        name: '',
        desc: '',
        filters: [],
        actions: []
    }

    itemsAdded = (filters, actions) => {
        this.setState({ filters, actions });
    }

    editDesc = ({ value }) => this.setState({ descEditing: value });
    setDesc = ({ currentTarget: { value } }) => this.setState({ desc: value });

    editName = ({ value }) => this.setState({ nameEditing: value });
    setName = ({ currentTarget: { value } }) => this.setState({ name: value });

    saveCopy = () => this.saveHandler(true);
    saveHandler = (saveAsCopy) => {
        const { id, name, desc, filters, actions, enabled } = this.state;
        const newHandler = { id, name, desc, filters, actions, enabled };

        if (!id || saveAsCopy === true) {
            delete newHandler.id;
        }

        this.props.saveHandler(newHandler);
    }

    isHandlerValid() {
        const { name, desc, filters, actions } = this.state;

        return !!((name?.trim() && desc?.trim()) && (filters?.length || actions?.length));
    }

    renderPage() {
        const { id, name, desc, filters, actions, nameEditing, descEditing } = this.state;
        const saveDisabled = !this.isHandlerValid();

        return (
            <div className="page-edit-handler">
                <DndProvider backend={HTML5Backend}>
                    <Toolbar>
                        <div className="p-toolbar-group-left">
                            <Inplace active={nameEditing} onToggle={this.editName} closable={true}>
                                <InplaceDisplay>
                                    <h3><i className="fa fa-random"></i> {name || '<<No name given>>'} <span className="fa fa-edit" /></h3>
                                </InplaceDisplay>
                                <InplaceContent>
                                    <InputText autoFocus value={name} maxLength={30} onChange={this.setName} />
                                </InplaceContent>
                            </Inplace>

                            <Inplace active={descEditing} onToggle={this.editDesc} closable={true}>
                                <InplaceDisplay>{desc || '<<No description provided>>'} <span className="fa fa-edit" /></InplaceDisplay>
                                <InplaceContent>
                                    <InputText autoFocus value={desc} maxLength={80} onChange={this.setDesc} />
                                </InplaceContent>
                            </Inplace>
                        </div>
                        <div className="p-toolbar-group-right">
                            <Button label="Save" icon="fa fa-folder-open" className="ui-button-success" onClick={this.saveHandler} disabled={saveDisabled} />
                            <Button label="Cancel" icon="fa fa-check" className="ui-button-warning" onClick={this.cancel} />
                            {!!id && <Button label="Copy" icon="fa fa-copy" className="ui-button-primary" onClick={this.saveCopy} disabled={saveDisabled} />}
                            {!!id && <Button icon="fa fa-trash" label="Delete" className="ui-button-danger" onClick={this.deleteHandler} />}
                        </div>
                    </Toolbar>
                    <div className="edit-handler-container">
                        <Controls />
                        <div className="body-panel">
                            <Builder filters={filters} actions={actions} onChange={this.itemsAdded} />
                        </div>
                    </div>
                </DndProvider>
            </div>
        );
    }
}

export default connect(null, actions)(Edit);
