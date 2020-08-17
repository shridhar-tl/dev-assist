import React, { Component } from 'react';
import { Dropdown } from 'primereact/dropdown';

const initiators = [
  'script', 'xmlhttprequest', 'stylesheet', 'image',
  'font', 'object', 'ping', 'csp_report', 'media',
  'websocket', 'other', 'main_frame', 'sub_frame'
];
export const COMMON_REQUEST_INITIATORS = initiators.map(v => ({ label: v, value: v }));

export default class InitiatorType extends Component {
  selectionChanged = ({ value }) => this.props.onChange(value ? value : null);

  render() {
    const { value } = this.props;

    return (
      <div className="p-col-12 p-md-6">
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Initiator</span>
          <Dropdown editable={true} filter={false} showClear={true} value={value} options={COMMON_REQUEST_INITIATORS}
            onChange={this.selectionChanged} style={{ width: '180px' }} placeholder="Any initiator type" />
        </div>
      </div>
    );
  }
}
