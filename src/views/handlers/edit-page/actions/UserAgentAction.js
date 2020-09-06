import React from 'react';
import BaseAction from './BaseAction';
import { UserInput } from '../../../../components';

const UserAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36 Edg/84.0.522.63',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0',
];

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