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
    state = this.getEmpthHandler()

    getEmpthHandler() {
        return {
            id: null,
            name: '',
            desc: '',
            filters: [],
            actions: []
        };
    }

    async componentDidMount() {
        const { getHandlerForEdit, match } = this.props;
        const id = match?.params?.id;

        if (id) {
            const handler = await getHandlerForEdit(id);

            this.setState(handler);
        }
    }

    itemsAdded = (filters, actions) => this.setState({ filters, actions });

    editDesc = ({ value }) => this.setState({ descEditing: value });
    setDesc = ({ currentTarget: { value } }) => this.setState({ desc: value });

    editName = ({ value }) => this.setState({ nameEditing: value });
    setName = ({ currentTarget: { value } }) => this.setState({ name: value });

    navigateToListPage = () => this.props.history.push('/handlers');

    saveCopy = () => this.saveHandler(true);
    saveHandler = async (saveAsCopy) => {
        const { id, name, desc, filters, actions, enabled, created } = this.state;
        const newHandler = { id, name, desc, filters, actions, enabled, created };

        if (!id || saveAsCopy === true) {
            delete newHandler.id;
        }

        await this.props.saveHandler(newHandler);

        this.navigateToListPage();
    }

    deleteHandler = async () => {
        await this.props.deleteHandlers(this.state.id);

        this.props.history.push('/handlers');
    }

    isHandlerValid() {
        const { name, desc, filters, actions } = this.state;

        return !!((name?.trim() && desc?.trim()) && (filters?.length || actions?.length));
    }

    tabChanged = (tabIndex) => this.setState({ tabIndex });

    renderPage() {
        const { id, name, desc, filters, actions, nameEditing, descEditing, tabIndex } = this.state;
        const saveDisabled = !this.isHandlerValid();

        const left = (
            <Inplace className="handler-name" active={nameEditing} onToggle={this.editName} closable={true}>
                <InplaceDisplay>
                    <h3 title="Click to edit the handler name">
                        <i className="fa fa-random"></i> {name || '<<No name given>>'}
                        <span className="fas fa-pencil-alt" />
                    </h3>
                </InplaceDisplay>
                <InplaceContent>
                    <InputText className="edit-name" placeholder="provide a handler name"
                        autoFocus value={name} maxLength={30} onChange={this.setName} />
                </InplaceContent>
            </Inplace>
        );

        const right = (<>
            <Button label="Save" icon="fa fa-folder-open" type="success" onClick={this.saveHandler} disabled={saveDisabled} />
            <Button label="Cancel" icon="fa fa-check" type="warning" onClick={this.navigateToListPage} />
            {!!id && <Button label="Save Copy" icon="fa fa-copy" type="primary" onClick={this.saveCopy} disabled={saveDisabled} />}
            {!!id && <Button icon="fa fa-trash" label="Delete" type="danger" onClick={this.deleteHandler} />}
        </>);

        return (
            <div className="page-edit-handler">
                <DndProvider backend={HTML5Backend}>
                    <Toolbar left={left} right={right}>
                        <div className="handler-desc-cntr">
                            <Inplace className="handler-desc" active={descEditing} onToggle={this.editDesc} closable={true}>
                                <InplaceDisplay>{desc || '<<No description provided>>'}
                                    <span className="fas fa-pencil-alt" title="Click to edit the handler description" /></InplaceDisplay>
                                <InplaceContent>
                                    <InputText className="edit-desc" placeholder="provide a description" autoFocus
                                        value={desc} maxLength={150} onChange={this.setDesc} />
                                </InplaceContent>
                            </Inplace>
                        </div>
                    </Toolbar>
                    <div className="edit-handler-container">
                        <Controls onTabChanged={this.tabChanged} tabIndex={tabIndex} />
                        <div className="body-panel">
                            <Builder tabIndex={tabIndex} filters={filters} actions={actions} onChange={this.itemsAdded} />
                        </div>
                    </div>
                </DndProvider>
            </div>
        );
    }
}

export default connect(null, actions)(Edit);
