
import React, { PureComponent } from 'react';
import { MultiSelect } from 'primereact/multiselect';

const DOMAIN_MATCHER = [
  { value: 'same', label: 'Same origin' },
  { value: 'crossorigin', label: 'Different root domain' },
  { value: 'crosssubdomain', label: 'Different sub Domain' },
  { value: 'noorigin', label: 'No origin' }
];

export default class OriginTypeList extends PureComponent {
  selectionChanged = ({ value }) => this.props.onChange(value?.length ? value : null);

  render() {
    const { value, size = 4 } = this.props;

    return (
      <div className={`p-md-${size}`}>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">Origin</span>
          <MultiSelect value={value} options={DOMAIN_MATCHER}
            filter={false} placeholder="Any origin"
            onChange={this.selectionChanged} />
        </div>
      </div>
    );
  }
}
