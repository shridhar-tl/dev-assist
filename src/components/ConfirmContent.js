import React, { PureComponent } from 'react';
import { hide } from '../common/toast';
import Button from '../controls/Button';

class ConfirmContent extends PureComponent {
    render() {
        const { onConfirm, onCancel, text = 'Are you sure?', note = 'Confirm to proceed' } = this.props;

        return (
            <div className="p-flex p-flex-column flex-1">
                <div className="p-text-center">
                    <i className="pi pi-exclamation-triangle font-big"></i>
                    <h4>{text}</h4>
                    <p>{note}</p>
                </div>
                <div className="p-grid p-fluid">
                    <div className="p-col-6">
                        <Button label="Yes" type="danger" onClick={onConfirm} />
                    </div>
                    <div className="p-col-6">
                        <Button label="No" type="secondary" onClick={onCancel || hide} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ConfirmContent;