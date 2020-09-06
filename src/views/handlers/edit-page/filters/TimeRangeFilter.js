import React from 'react';
import BaseFilter from './BaseFilter';
import { TimeRange } from '../../../../components';
import { Checkbox } from '../../../../controls';

const max = (24 * 60);

class TimeRangeFilter extends BaseFilter {
    static initItem(item) {
        item.range = [480, 1200];
        return item;
    }

    rangeChanged = (range) => this.triggerChange({ ...this.props.item, range });
    excludeRange = (excludeRange) => this.triggerChange({ ...this.props.item, excludeRange });

    getErrorMessages(item) {
        const { range } = item || this.props.item;

        if (range[0] === 0 && range[1] === max) {
            return 'This filter is not required if whole day is selected';
        }

        return null;
    }

    renderFilter() {
        const { item: { range, excludeRange } } = this.props;

        return (
            <div>
                <div className="p-grid">
                    <div className="p-md-6">
                        <span>Choose time range of day{excludeRange ? ' to be excluded' : ''}:</span>
                    </div>
                    <div className="p-md-6">
                        <Checkbox checked={excludeRange} onChange={this.excludeRange} label="Exclude the selected time range" />
                    </div>
                </div>
                <div>
                    <TimeRange value={range} onChange={this.rangeChanged} />
                </div>
            </div>
        );
    }
}

export default TimeRangeFilter;