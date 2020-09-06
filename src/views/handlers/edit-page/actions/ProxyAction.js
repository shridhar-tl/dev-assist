import React from 'react';
import BaseAction from './BaseAction';
import { Dropdown } from 'primereact/dropdown';
import { UserInput } from '../../../../components';

const proxyMode = [
    { value: 'direct', label: 'Use No Proxy' },
    //{ value: 'auto_detect', label: '' },
    //{ value: 'pac_script', label: '' },
    { value: 'fixed_servers', label: 'Specify proxy' },
    { value: 'system', label: 'Use system default' },
];

class ProxyAction extends BaseAction {
    static initItem(item) {
        item.hasError = true;
        item.mode = 'fixed_servers';
        return item;
    }

    modeChanged = ({ value: mode }) => {
        const item = { ...this.props.item, mode };

        if (mode !== 'fixed_servers') {
            delete item.value;
        }

        this.triggerChange(item);
    }
    valueChanged = (value) => this.triggerChange({ ...this.props.item, value });

    getErrorMessages(item) {
        const { mode, value } = item || this.props.item;

        if (mode === 'fixed_servers' && !value?.trim()) {
            return 'Proxy is required for selected mode';
        }

        return null;
    }

    renderAction() {
        const { item: { mode, value } } = this.props;

        return (
            <div className="p-grid">
                <div className="p-md-4">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">Mode</span>
                        <Dropdown editable={false} filter={false} showClear={false} value={mode} options={proxyMode}
                            onChange={this.modeChanged} style={{ width: '180px' }} placeholder="Select mode" />
                    </div>
                </div>
                {mode === 'fixed_servers' && <UserInput label="Proxy" value={value} onChange={this.valueChanged} />}
            </div>
        );
    }
}

export default ProxyAction;