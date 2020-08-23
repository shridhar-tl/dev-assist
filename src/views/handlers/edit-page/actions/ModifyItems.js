import React from 'react';
import BaseAction from './BaseAction';
import { Dropdown } from 'primereact/dropdown';
import { UserInput } from '../../../../components';

const actionTypes = [
    { value: 'addO-modify', label: 'Add or Modify' },
    { value: 'add', label: 'Add if not exist' },
    { value: 'modify', label: 'Modify if exist' },
    { value: 'remove', label: 'Remove' }
];

class ModifyItems extends BaseAction {
    actionChanged = ({ value: type }) => {
        const { item, index, onChange } = this.props;

        onChange({ ...item, type }, index);
    }

    keyChanged = (key) => {
        const { item, index, onChange } = this.props;

        onChange({ ...item, key }, index);
    }

    valueChanged = (value) => {
        const { item, index, onChange } = this.props;

        onChange({ ...item, value }, index);
    }

    renderAction() {
        const { item: { type, key, value }, nameControl: NameControl } = this.props;

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

                {!NameControl && <UserInput label="Name" value={value} onChange={this.keyChanged} />}

                <UserInput label="Value" value={value} onChange={this.valueChanged} />
            </div>
        );
    }
}

export default ModifyItems;
