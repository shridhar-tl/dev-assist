import React from 'react';
import BaseAction from './BaseAction';
import { Dropdown } from 'primereact/dropdown';
import { UserInput } from '../../../../components';
import { ActionModifyItemType } from '../../../../common/constants';

const actionTypes = [
    { value: ActionModifyItemType.AddOrModify, label: 'Add or Modify' },
    { value: ActionModifyItemType.Add, label: 'Add if not exist' },
    { value: ActionModifyItemType.Modify, label: 'Modify if exist' },
    { value: ActionModifyItemType.Remove, label: 'Remove' }
];

class ModifyItems extends BaseAction {
    actionChanged = ({ value: type }) => {
        const item = { ...this.props.item, type };

        if (type === 'remove') {
            delete item.value;
        }

        this.triggerChange(item);
    }

    keyChanged = (key) => this.triggerChange({ ...this.props.item, key });
    valueChanged = (value) => this.triggerChange({ ...this.props.item, value });

    getErrorMessages(item) {
        const { type, key, value } = item || this.props.item;

        if (!key?.trim()) {
            return 'Please provide the name.';
        }
        else if (type !== 'remove' && !value?.trim()) {
            return 'Value is required for selected action.';
        }

        return null;
    }

    renderAction() {
        const {
            item: { type, key, value },
            nameControl: NameControl
        } = this.props;

        return (
            <div className="p-grid">
                <div className="p-md-4">
                    <div className="p-inputgroup">
                        <span className="p-inputgroup-addon">Action</span>
                        <Dropdown editable={false} filter={false} showClear={false} value={type} options={actionTypes}
                            onChange={this.actionChanged} style={{ width: '180px' }} placeholder="Add or modify" />
                    </div>
                </div>

                {!!NameControl && (<NameControl value={key} onChange={this.keyChanged} />)}

                {!NameControl && <UserInput label="Name" value={key} onChange={this.keyChanged} />}

                {type !== 'remove' && <UserInput label="Value" value={value} onChange={this.valueChanged} />}
            </div>
        );
    }
}

export default ModifyItems;
