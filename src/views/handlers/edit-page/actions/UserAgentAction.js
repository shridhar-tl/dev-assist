import React from 'react';
import BaseAction from './BaseAction';
import { UserInput } from '../../../../components';

class UserAgentAction extends BaseAction {
    static initItem(item) {
        item.value = navigator.userAgent;
        return item;
    }

    keyChanged = ({ value: key }) => this.triggerChange({ ...this.props.item, key });
    valueChanged = (value) => this.triggerChange({ ...this.props.item, value });

    renderAction() {
        const { item: { value = '' } } = this.props;

        return (
            <div className="p-grid">
                <UserInput label="User agent" size={12} value={value} onChange={this.valueChanged} />
            </div>
        );
    }
}

export default UserAgentAction;