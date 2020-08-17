import React from 'react';
import BaseFilter from './BaseFilter';
import { WeekDaysSelector } from '../../../../components';

class DayOfWeekFilter extends BaseFilter {

    daysChanged = (days) => {
        const { index, onChange } = this.props;
        let { item } = this.props;

        item = { ...item, days };

        onChange(item, index);
    }

    renderFilter() {
        const { item: { days } } = this.props;

        return (<div className="inline-row">
            <span>Choose active days of week:</span>
            <WeekDaysSelector value={days} onChange={this.daysChanged} /></div>
        );
    }
}

export default DayOfWeekFilter;