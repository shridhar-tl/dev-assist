import React from 'react';
import BaseFilter from './BaseFilter';
import { ComparerList, UserInput } from '../../../../components';

class ScalarFieldFilter extends BaseFilter {
    comparerChanged = (comparer) => {
        const { index, onChange } = this.props;
        let { item } = this.props;

        item = { ...item, comparer };

        onChange(item, index);
    }

    valueChanged = (value) => {
        const { index, onChange } = this.props;
        let { item } = this.props;

        item = { ...item, value };

        onChange(item, index);
    }

    renderFilter() {
        const { item: { comparer, value }, fieldName } = this.props;

        return (
            <div className="inline-row">
                <span>{fieldName}</span>
                <ComparerList value={comparer} onChange={this.comparerChanged} />
                <UserInput value={value} onChange={this.valueChanged} />
            </div>
        );
    }
}

export default ScalarFieldFilter;