import React from 'react';
import { connect } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import BasePage from '../../BasePage';
import { Button } from '../../../controls';
import Controls from './Controls';
import Builder from './Builder';
import * as actions from '../../../store/actions/handlers';
import './Edit.scss';

class Edit extends BasePage {
    state = this.getEmpthHandler()

    getEmpthHandler() {
        return {
            id: null,
            enabled: true,
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

    enabledChanged = ({ value: enabled }) => this.setState({ enabled });

    itemsAdded = (filters, actions) => {
        const hasError = filters?.some(({ hasError }) => hasError)
            || !actions?.length
            || actions.some(({ hasError }) => hasError);

        this.setState({ filters, actions, hasError });
    }

    editDesc = ({ value }) => this.setState({ descEditing: value });
    setDesc = ({ currentTarget: { value } }) => this.setState({ desc: value });

    editName = ({ value }) => this.setState({ nameEditing: value });
    setName = ({ currentTarget: { value } }) => this.setState({ name: value });

    navigateToListPage = () => this.props.history.push('/handlers');

    saveCopy = () => this.saveHandler(true);
    saveHandler = async (saveAsCopy) => {
        const { id, name, desc, filters, actions, enabled, created, hasError } = this.state;
        const newHandler = { id, name, desc, filters, actions, enabled, created, hasError };

        if (!id || saveAsCopy === true) {
            delete newHandler.id;
        }

        if (!hasError) {
            delete newHandler.hasError;
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
        const { id, enabled, name, desc, filters, actions, nameEditing, descEditing, tabIndex } = this.state;
        const saveDisabled = !this.isHandlerValid();

        const left = (<Inplace className="handler-name" active={nameEditing} onToggle={this.editName} closable={true}>
            <InplaceDisplay>
                <h3 title="Click to edit the handler name">
                    <i className="fa fa-random"></i> {name || '<<No name given>>'}
                    <span className="fas fa-pencil-alt" />
                </h3>
            </InplaceDisplay>
            <InplaceContent>
                <InputText className="edit-name" placeholder="provide a handler name"
                    autoFocus value={name} maxLength={50} onChange={this.setName} />
            </InplaceContent>
        </Inplace>
        );

        const right = (<>
            <Button label="Save" icon="fa fa-folder-open" type="success" onClick={this.saveHandler} disabled={saveDisabled} />
            <Button label="Cancel" icon="fa fa-check" type="warning" onClick={this.navigateToListPage} />
            {!!id && <Button label="Save Copy" icon="fa fa-copy" type="primary" onClick={this.saveCopy} disabled={saveDisabled} />}
            {!!id && <Button icon="fa fa-trash" label="Delete" type="danger" onClick={this.deleteHandler} />}
        </>);

        const center = (
            <Inplace className="handler-desc pull-left" active={descEditing} onToggle={this.editDesc} closable={true}>
                <InplaceDisplay>
                    <span>{desc || '<<No description provided>>'}</span>
                    <span className="fas fa-pencil-alt" title="Click to edit the handler description" />
                </InplaceDisplay>
                <InplaceContent>
                    <InputText className="edit-desc" placeholder="provide a description" autoFocus
                        value={desc} maxLength={150} onChange={this.setDesc} />
                </InplaceContent>
            </Inplace>
        );

        const toolbar = (
            <div className="toolbar">
                <div className="clearfix">
                    <div className="pull-left">{left}</div>
                    <div className="pull-right">{right}</div>
                </div>
                <div className="handler-desc-cntr clearfix">
                    {center}
                    <div className="pull-right">
                        <InputSwitch checked={enabled} onChange={this.enabledChanged} />
                    </div>
                </div>
            </div>
        );

        return (
            <div className="page-edit-handler">
                {toolbar}
                <DndProvider backend={HTML5Backend}>
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
