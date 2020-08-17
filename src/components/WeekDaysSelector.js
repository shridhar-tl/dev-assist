import React, { PureComponent } from 'react';
import array from '../common/js-extn';

const shortDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const defaultValue = [1, 2, 3, 4, 5];

class WeekDaysSelector extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { value: props.value || defaultValue };
    }

    UNSAFE_componentWillReceiveProps(props) {
        let { value } = props;
        if (!value) {
            value = value || defaultValue;
        }

        if (this.state.value !== value) {
            this.setState({ value });
        }
    }

    getClass($index) {
        return this.state.value.indexOf($index) > -1 ? 'day day-on' : 'day';
    }

    daySelected(index) {
        let { value } = this.state;
        const pos = value.indexOf(index);

        if (pos === -1) {
            value = value.concat(index);
        }
        else {
            value.splice(pos, 1);
        }

        value = array(value).sortBy()();
        this.setState({ value });
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