import React from 'react';
import BaseFilter from './BaseFilter';
import { RequestMethodList, InitiatorType } from '../../../../components';

class RequestTypeFilter extends BaseFilter {
    setRequestMethod = (verbs) => {
        const { index, onChange } = this.props;
        let { item } = this.props;

        item = { ...item, verbs };

        onChange(item, index);
    }

    setInitiator = (initiator) => {
        const { index, onChange } = this.props;
        let { item } = this.props;

        item = { ...item, initiator };

        onChange(item, index);
    }

    renderFilter() {
        const { item: { verbs, initiator } } = this.props;

        return (
            <div className="inline-row">
                <RequestMethodList value={verbs} onChange={this.setRequestMethod} />
                <InitiatorType value={initiator} onChange={this.setInitiator} />
            </div>
        );
    }
}

export default RequestTypeFilter;