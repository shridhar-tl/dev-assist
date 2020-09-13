import React, { PureComponent } from 'react';
import { Dropdown } from 'primereact/dropdown';

const COMMON_COMPARERS = [
  { label: 'is equal to', value: '===' },
  { label: 'is not equal to', value: '!==' },
  { label: 'contains', value: '%', allowedTo: ['string'] },
  { label: 'does not contain', value: '!%', allowedTo: ['string'] },
  //{ label: 'is greater than', value: '>', allowedTo: ['number', 'time'] },
  //{ label: 'is greater than or equals', value: '>=', allowedTo: ['number', 'time'] },
  //{ label: 'is lesser than', value: '<', allowedTo: ['number', 'time'] },
  //{ label: 'is lesser than or equals', value: '<=', allowedTo: ['number', 'time'] },
  { label: 'is any of', value: '[]', multiValue: true },
  { label: 'is none of', value: '[!]', multiValue: true },
  { label: 'contains any of', value: '[%]', multiValue: true, allowedTo: ['string'] },
  { label: 'contains none of', value: '[!%]', multiValue: true, allowedTo: ['string'] },
  { label: 'starts with', value: '~_', allowedTo: ['string'] },
  { label: 'ends with', value: '_~', allowedTo: ['string'] },
  { label: 'starts with any of', value: '[~_]', multiValue: true, allowedTo: ['string'] },
  { label: 'ends with any of', value: '[_~]', multiValue: true, allowedTo: ['string'] },
  //{ label: 'is available', value: '~', allowedTo: [], noInput: true },
  //{ label: 'is not available', value: '!', allowedTo: [], noInput: true },
  { label: 'has some value', value: '*', noInput: true, allowedTo: ['string'] },
  { label: 'is empty', value: '-', noInput: true, allowedTo: ['string'] },
  { label: 'matches (regex)', value: '$', allowedTo: ['string'] },
  { label: 'matches (wildcard)', value: '$*', allowedTo: ['string'] }
];

export const comparerOptions = COMMON_COMPARERS.reduce((obj, cur) => {
  const { value, multiValue, noInput } = cur;

  if (multiValue || noInput) {
    obj[value] = { multiValue, noInput };
  }

  return obj;
}, {});

export const comparerMap = COMMON_COMPARERS.reduce((obj, cur) => {
  obj[cur.value] = cur;
  return obj;
}, {});

export class ComparerList extends PureComponent {
  constructor(props) {
    super(props);
    const fieldType = props.fieldType || 'string';
    this.list = COMMON_COMPARERS.filter(i => (i.allowedTo || []).length === 0 || i.allowedTo.includes(fieldType));
  }

  selectionChanged = ({ value }) => this.props.onChange(value, comparerMap[value]);

  render() {
    const { label = 'Compare', size = 4, value } = this.props;

    let control = (
      <Dropdown value={value} options={this.list} onChange={this.selectionChanged}
        style={{ width: '180px' }} placeholder="Choose a comparer" />
    );

    if (label) {
      control = (<div className="p-inputgroup"><span className="p-inputgroup-addon">{label}</span>{control}</div>);
    }

    return <div className={`p-md-${size}`}>{control}</div>;
  }
}

export default ComparerList;
