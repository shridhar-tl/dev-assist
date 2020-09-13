import React from 'react';
import BaseFilter from './BaseFilter';
import { FILTERS_ADDED, DRAG_TYPE_FILTER, filterMap } from '.';
import SortableContainer from '../../SortableContainer';

const filtersDropPlaceholder = 'Drag and drop additional filters into group.';

class FilterGroup extends BaseFilter {
    constructor(props) {
        super(props);
        this.filterAccepts = [FILTERS_ADDED, DRAG_TYPE_FILTER];
    }

    static initItem(item) {
        item.filters = [];
        item.hasError = true;
        return item;
    }

    onChange = (filters) => {
        let { item } = this.props;
        const hasError = filters.length < 2 || filters.some(({ hasError }) => hasError)

        item = { ...item, filters, hasError };

        if (!hasError) {
            delete item.hasError;
        }

        this.triggerChange(item);
    }

    getErrorMessages() {
        const { item: { filters } } = this.props;

        if (filters.length < 2) {
            return 'Atleast two filters are required inside the group';
        }
        else {
            return 'Some of the filters have validation issues';
        }
    }

    renderFilter() {
        const { item } = this.props;
        const { filters } = item;

        return (
            <SortableContainer containerId="filters-group-list" className="filters-group" items={filters} mapper={filterMap}
                itemType={FILTERS_ADDED} accepts={this.filterAccepts} placeholder={filtersDropPlaceholder} onChange={this.onChange} />
        );
    }
}

export default FilterGroup;