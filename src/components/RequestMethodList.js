
import React, { PureComponent } from 'react';
import { MultiSelect } from 'primereact/multiselect';

const verbs = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE'];
export const HTTP_REQUEST_METHOD = verbs.map(v => ({ value: v, label: v }));

export default class RequestMethodList extends PureComponent {
  selectionChanged = ({ value }) => this.props.onChange(value?.length ? value : null);

  render() {
    const { value } = this.props;

    return (
      <div className="p-col-12 p-md-6">
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Request method</span>
          <MultiSelect value={value} options={HTTP_REQUEST_METHOD}
            filter={false} placeholder="Any request methods"
            onChange={this.selectionChanged} style={{ width: '200px' }} />
        </div>
      </div>
    );
  }
}
