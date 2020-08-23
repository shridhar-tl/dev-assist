import React, { PureComponent } from 'react';
import { FILTERS_ADDED, DRAG_TYPE_FILTER, filterMap } from './filters';
import { ACTIONS_ADDED, DRAG_TYPE_ACTION, actionMap } from './actions';
import SortableContainer from '../SortableContainer';
import './Builder.scss';

const filtersDropPlaceholder = 'Drag and drop more filters.';
const filtersDropEmptyPlaceholder = 'Drag and drop one or more filters from left hand side.';
const actionsDropPlaceholder = 'Drag and drop more actions.';
const actionsDropEmptyPlaceholder = 'Drag and drop one or more actions from left hand side.';

const filterAccepts = [FILTERS_ADDED, DRAG_TYPE_FILTER];
const actionsAccepts = [ACTIONS_ADDED, DRAG_TYPE_ACTION];

class Builder extends PureComponent {
    onFiltersChanged = (filters) => {
        const { actions, onChange } = this.props;
        onChange(filters, actions);
    }

    onActionsChanged = (actions) => {
        const { filters, onChange } = this.props;
        onChange(filters, actions);
    }

    render() {
        const { filters, actions, tabIndex } = this.props;

        return (
            <div className="handler-builder">

                {!tabIndex && (
                    <div className="drop-item-container">
                        <div className="header">
                            <span className="pi pi-filter" />
                            <span className="title">Filters list</span>
                            <span className="info">Drag and drop filters from left hand panel which would be used to filter the request.</span>
                        </div>
                        <div className="items-container">
                            <SortableContainer containerId="filters-list" className="filters-added" items={filters}
                                itemType={FILTERS_ADDED} accepts={filterAccepts} mapper={filterMap}
                                placeholder={!filters?.length ? filtersDropEmptyPlaceholder : filtersDropPlaceholder}
                                onChange={this.onFiltersChanged} />
                        </div>
                    </div>
                )}
                {tabIndex === 1 && (
                    <div className="drop-item-container">
                        <div className="header">
                            <span className="pi pi-play" />
                            <span className="title">Actions list</span>
                            <span className="info">All the requests matching the specified filter will be applied with below actions.</span>
                        </div>
                        <div className="items-container">
                            <SortableContainer containerId="actions-list" className="droppable actions-added" items={actions}
                                itemType={ACTIONS_ADDED} accepts={actionsAccepts} mapper={actionMap}
                                placeholder={!actions?.length ? actionsDropEmptyPlaceholder : actionsDropPlaceholder}
                                onChange={this.onActionsChanged} />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Builder;