import React from 'react';
import BaseAction from './BaseAction';
import { Dropdown } from 'primereact/dropdown';
import { UserInput } from '../../../../components';

const URL_MATCHER = [
    { value: 'url', label: 'Full Url' },
    { value: 'protocol', label: 'Protocol' },
    { value: 'host', label: 'Full Domain (Host)' },
    { value: 'root-host', label: 'Root Domain' },
    { value: 'sub-domain', label: 'Sub Domain' },
    //{ value: 'domain-extn', label: 'Domain extension' },
    { value: 'port', label: 'Port' },
    { value: 'path', label: 'Path (excluding domain)' }
];

class UrlReplaceAction extends BaseAction {
    keyChanged = ({ value: key }) => this.triggerChange({ ...this.props.item, key });
    valueChanged = (value) => this.triggerChange({ ...this.props.item, value });

    getErrorMessages(item) {
        const { key, value } = item || this.props.item;

        if (!key?.trim()) {
            return 'Please select what has to be replaced in url';
        }
        else if (!value?.trim()) {
            return 'Please provide the value to be replaced with';
        }

        return null;
    }

    renderAction() {
        const { item: { key = "", value = "" } } = this.props;

        return (
            <div className="p-grid">
                <div className="p-md-4">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">Replace what</span>
                        <Dropdown editable={true} filter={false} showClear={true} value={key} options={URL_MATCHER}
                            onChange={this.keyChanged} style={{ width: '180px' }} placeholder="Full Url" />
                    </div>
                </div>

                <UserInput label="New value" value={value} onChange={this.valueChanged} />
            </div>
        );
    }
}

export default UrlReplaceAction;