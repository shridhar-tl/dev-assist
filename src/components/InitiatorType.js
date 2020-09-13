import React, { PureComponent } from 'react';
import { MultiSelect } from 'primereact/multiselect';

export const COMMON_REQUEST_INITIATORS = [
  { label: 'XHR', value: 'xmlhttprequest' },
  { label: 'Script (JavaScript)', value: 'script' },
  { label: 'Styles (CSS)', value: 'stylesheet' },
  { label: 'Image', value: 'image' },
  { label: 'Font', value: 'font' },
  { label: 'Media', value: 'media' },
  { label: 'Web socket', value: 'websocket' },
  { label: 'Main Document', value: 'main_frame' },
  { label: 'iFrame Document', value: 'sub_frame' },
  { label: 'Object', value: 'object' },
  { label: 'Ping', value: 'ping' },
  { label: 'CSP Report', value: 'csp_report' },
  { label: 'Other', value: 'other' }
];

export default class InitiatorType extends PureComponent {
  selectionChanged = ({ value }) => this.props.onChange(value ? value : null);

  render() {
    const { value, size = 4 } = this.props;

    return (
      <div className={`p-md-${size}`}>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Request type</span>
          <MultiSelect filter={false} showClear={true} value={value} options={COMMON_REQUEST_INITIATORS}
            onChange={this.selectionChanged} style={{ width: '180px' }} placeholder="Any request type" />
        </div>
      </div>
    );
  }
}
