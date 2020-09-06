import React from 'react';
import BaseFilter from './BaseFilter';
import { MultiSelect } from 'primereact/multiselect';
import { RequestMethodList, InitiatorType } from '../../../../components';

const DOMAIN_MATCHER = [
    { value: 'same', label: 'Same origin' },
    { value: 'crossorigin', label: 'Different root domain' },
    { value: 'crosssubdomain', label: 'Different sub Domain' },
    { value: 'noorigin', label: 'No origin' }
];

class RequestTypeFilter extends BaseFilter {
    setRequestMethod = (verbs) => this.triggerChange({ ...this.props.item, verbs });
    setRequestType = (requestType) => this.triggerChange({ ...this.props.item, requestType });
    setOriginMatch = ({ value: origin }) => this.triggerChange({ ...this.props.item, origin });

    getErrorMessages(item) {
        item = item || this.props.item;

        const { verbs, requestType, origin } = item;

        if (!verbs?.length && !requestType?.length && !origin) {
            return 'Either request method, request type or Origin should be selected';
        }

        return null;
    }

    renderFilter() {
        const { item: { verbs, requestType, origin } } = this.props;

        return (
            <div className="p-grid">
                <RequestMethodList value={verbs} onChange={this.setRequestMethod} />
                <InitiatorType value={requestType} onChange={this.setRequestType} />

                <div className="p-md-4">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">Origin</span>
                        <MultiSelect value={origin} options={DOMAIN_MATCHER}
                            filter={false} placeholder="Any origin"
                            onChange={this.setOriginMatch} />
                    </div>
                </div>
            </div>
        );
    }
}

export default RequestTypeFilter;