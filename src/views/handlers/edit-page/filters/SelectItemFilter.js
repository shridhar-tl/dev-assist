import React from 'react';
import BaseFilter from './BaseFilter';

class SelectItemFilter extends BaseFilter {
    getErrorMessages(item) {
        item = item || this.props.item;

        const { value } = item;

        return value?.length ? '' : `Please select a ${this.props.fieldName}`;
    }

    renderFilter() {
        const { item: { value }, Control } = this.props;

        return (
            <div className="p-grid">
                <Control size={12} value={value} onChange={this.valueChanged} />
            </div>
        );
    }
}

export default SelectItemFilter;