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
        return item;
    }

    onChange = (filters) => {
        let { item, onChange, index } = this.props;
        item = { ...item, filters };

        onChange(item, index);
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