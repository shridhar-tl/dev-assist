import React from 'react';
import BaseFilter from './BaseFilter';
import { WeekDaysSelector } from '../../../../components';

class DayOfWeekFilter extends BaseFilter {
    static initItem(item) {
        item.days = [1, 2, 3, 4, 5];
        return item;
    }

    daysChanged = (days) => this.triggerChange({ ...this.props.item, days });

    getErrorMessages(item) {
        const { days } = item || this.props.item;

        if (days.length < 1) {
            return 'Atleast one day of the week should be selected';
        }
        else if (days.length === 7) {
            return 'If all the days are selected then their is no need for this filter';
        }

        return null;
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