import React from 'react';
import BaseFilter from './BaseFilter';
import { HeaderList, ComparerList, UserInput } from '../../../../components';

class HeaderFilter extends BaseFilter {
    keyChanged = (key) => {
        const { index, onChange } = this.props;
        let { item } = this.props;

        item = { ...item, key };

        onChange(item, index);
    }

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
        const { item: { key, comparer, value } } = this.props;

        return (
            <div className="p-grid">
                <HeaderList value={key} onChange={this.keyChanged} />
                <ComparerList value={comparer} onChange={this.comparerChanged} />
                <UserInput value={value} onChange={this.valueChanged} />
            </div>
        );
    }
}

export default HeaderFilter;
