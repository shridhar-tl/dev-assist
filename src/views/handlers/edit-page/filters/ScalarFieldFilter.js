import React from 'react';
import BaseFilter from './BaseFilter';
import { ComparerList, UserInput, comparerOptions } from '../../../../components';

class ScalarFieldFilter extends BaseFilter {
    static initItem(item) {
        item.comparer = '===';
        item.hasError = true;
        return item;
    }

    getErrorMessages(item) {
        item = item || this.props.item;

        const { comparer, value } = item;

        return this.validateValueWithComparerAndGetErrorMessage(value, comparer);
    }

    renderFilter() {
        const { item: { comparer, value }, fieldName } = this.props;
        const { multiValue, noInput } = comparerOptions[comparer] || '';

        return (
            <div className="p-grid">
                <ComparerList label={fieldName} value={comparer} onChange={this.comparerChanged} />
                {!noInput && <UserInput value={value} onChange={this.valueChanged} multiValue={multiValue} />}
            </div>
        );
    }
}

export default ScalarFieldFilter;