import React from 'react';
import BaseFilter from './BaseFilter';
import { HeaderList, ComparerList, UserInput, comparerOptions } from '../../../../components';

class HeaderFilter extends BaseFilter {
    static initItem(item) {
        item.comparer = '===';
        item.hasError = true;
        return item;
    }

    getErrorMessages(item) {
        item = item || this.props.item;

        const { key, comparer, value } = item;

        if (!key) {
            return 'Header name is required and not provided';
        }

        return this.validateValueWithComparerAndGetErrorMessage(value, comparer);
    }

    renderFilter() {
        const { item: { key, comparer, value } } = this.props;
        const { multiValue, noInput } = comparerOptions[comparer] || '';

        return (
            <div className="p-grid">
                <HeaderList value={key} onChange={this.keyChanged} />
                <ComparerList value={comparer} onChange={this.comparerChanged} />
                {!noInput && <UserInput value={value} onChange={this.valueChanged} multiValue={multiValue} />}
            </div>
        );
    }
}

export default HeaderFilter;
