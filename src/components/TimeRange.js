import React, { PureComponent } from 'react';
import { Slider } from 'primereact/slider';
import { convertToTime } from '../common/common';

const max = (24 * 60);

class TimeRange extends PureComponent {
    getHour(value) {
        if (value === 0 || value === max) { return 'Midnight'; }

        return convertToTime(value).format('hh:mm tt');
    }

    rangeChanged = ({ value }) => this.props.onChange(value);

    render() {
        const { value = [0, max] } = this.props;

        return (
            <div>
                <span>Selected Range: {this.getHour(value[0])} - {this.getHour(value[1])}</span>
                <Slider range={true} value={value} min={0} max={max} step={5} onChange={this.rangeChanged} />
            </div>
        );
    }
}

export default TimeRange;