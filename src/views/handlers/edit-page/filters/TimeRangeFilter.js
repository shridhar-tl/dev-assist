import React from 'react';
import BaseFilter from './BaseFilter';
import { TimeRange } from '../../../../components';

class TimeRangeFilter extends BaseFilter {

    rangeChanged = (range) => {
        const { index, onChange } = this.props;
        let { item } = this.props;

        item = { ...item, range };

        onChange(item, index);
    }

    renderFilter() {
        const { item: { range } } = this.props;

        return (<div>
            <span>Choose time range of day:</span>
            <TimeRange value={range} onChange={this.rangeChanged} /></div>
        );
    }
}

export default TimeRangeFilter;