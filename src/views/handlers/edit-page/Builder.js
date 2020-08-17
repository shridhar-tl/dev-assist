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
        const { filters, actions } = this.props;

        return (
            <div className="handler-builder">
                <SortableContainer containerId="filters-list" className="filters-added" items={filters}
                    itemType={FILTERS_ADDED} accepts={filterAccepts} mapper={filterMap}
                    placeholder={!filters?.length ? filtersDropEmptyPlaceholder : filtersDropPlaceholder}
                    onChange={this.onFiltersChanged} />
                <SortableContainer containerId="actions-list" className="droppable actions-added" items={actions}
                    itemType={ACTIONS_ADDED} accepts={actionsAccepts} mapper={actionMap}
                    placeholder={!actions?.length ? actionsDropEmptyPlaceholder : actionsDropPlaceholder}
                    onChange={this.onActionsChanged} />
            </div>
        );
    }
}

export default Builder;