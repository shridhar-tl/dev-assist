import React from 'react';
import BaseAction from './BaseAction';
import { UserInput } from '../../../../components';

class UserAgentAction extends BaseAction {
    keyChanged = ({ value: key }) => {
        const { item, index, onChange } = this.props;

        onChange({ ...item, key }, index);
    }

    valueChanged = (value) => {
        const { item, index, onChange } = this.props;

        onChange({ ...item, value }, index);
    }

    renderAction() {
        const { item: { value = "" } } = this.props;

        return (
            <div className="p-grid">
                <UserInput label="User agent" size={8} value={value} onChange={this.valueChanged} />
            </div>
        );
    }
}

export default UserAgentAction;