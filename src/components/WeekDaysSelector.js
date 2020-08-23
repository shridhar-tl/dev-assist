import React, { PureComponent } from 'react';
import array from '../common/js-extn';

const shortDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const defaultValue = [1, 2, 3, 4, 5];

class WeekDaysSelector extends PureComponent {
    getClass($index) {
        return (this.props.value || defaultValue).indexOf($index) > -1 ? 'day day-on' : 'day';
    }

    daySelected(index) {
        let { value } = this.props;
        const pos = value.indexOf(index);

        if (pos === -1) {
            value = value.concat(index);
        }
        else {
            value.splice(pos, 1);
        }

        value = array(value).sortBy()();
        this.props.onChange(value);
    }

    render() {
        return (
            <div className="daysinweek">
                {shortDays.map((day, i) => <div key={day} className={this.getClass(i)} onClick={() => this.daySelected(i)}>{day}</div>)}
            </div>
        );
    }
}

export default WeekDaysSelector;