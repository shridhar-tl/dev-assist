import React from 'react';
import BaseAction from './BaseAction';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';
import { UserInput } from '../../../../components';

class CustomScriptAction extends BaseAction {
    keyChanged = ({ value }) => this.triggerChange({ ...this.props.item, key: value === 'url', value: '' });
    valueChanged = (value) => this.triggerChange({ ...this.props.item, value });
    codeChanged = ({ target: { value } }) => this.valueChanged(value);

    renderAction() {
        const { item: { key, value } } = this.props;

        return (
            <div className="p-grid">
                <div className="p-md-2">
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="fromURL" value="url" name="mode" onChange={this.keyChanged} checked={key} />
                        <label htmlFor="fromURL">From URL</label>
                    </div>
                </div>
                <div className="p-md-2">
                    <div className="p-field-radiobutton">
                        <RadioButton inputId="fromCode" value="code" name="mode" onChange={this.keyChanged} checked={!key} />
                        <label htmlFor="fromCode">From Code</label>
                    </div>
                </div>
                <br />

                {key && <UserInput label="URL" size={12} value={value} onChange={this.valueChanged} />}

                {!key && <div className="p-md-12">
                    <span className="p-float-label">
                        <InputTextarea id="code" rows={5} cols={120} value={value} onChange={this.codeChanged} autoResize />
                        <label htmlFor="code">Custom code</label>
                    </span>
                </div>}
            </div>
        );
    }
}

export default CustomScriptAction;