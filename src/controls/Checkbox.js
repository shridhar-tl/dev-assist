import React, { PureComponent } from 'react';
import { Checkbox as PCheckbox } from 'primereact/checkbox';

let lastCBId = 0;

class Checkbox extends PureComponent {
    uniqueId = `cb_${(++lastCBId)}`;

    onChange = ({ checked }) => this.props.onChange(checked);

    render() {
        const { checked, label } = this.props;

        return (<>
            <PCheckbox inputId={this.uniqueId} onChange={this.onChange} checked={checked} />
            {!!label && <label htmlFor={this.uniqueId} className="p-checkbox-label">{label}</label>}
        </>
        );
    }
}

export default Checkbox;