
import React, { PureComponent } from 'react';
import { MultiSelect } from 'primereact/multiselect';

const protocols = ['http', 'https', 'others'];
export const PROTOCOL_LIST = protocols.map(v => ({ value: v, label: v }));

export default class ProtocolList extends PureComponent {
  selectionChanged = ({ value }) => this.props.onChange(value?.length ? value : null);

  render() {
    const { value, size = 4 } = this.props;

    return (
      <div className={`p-md-${size}`}>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Protocol type</span>
          <MultiSelect value={value} options={PROTOCOL_LIST}
            filter={false} placeholder="Choose protocol"
            onChange={this.selectionChanged} />
        </div>
      </div>
    );
  }
}
