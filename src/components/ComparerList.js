import React, { Component } from 'react';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';

const COMMON_COMPARERS = [
  { label: 'is equal to', value: '===' },
  { label: 'is not equal to', value: '!==' },
  { label: 'contains', value: '%' },
  { label: 'does not contain', value: '!%' },
  //{ label: 'is greater than', value: '>', allowedTo: ['number', 'time'] },
  //{ label: 'is greater than or equals', value: '>=', allowedTo: ['number', 'time'] },
  //{ label: 'is lesser than', value: '<', allowedTo: ['number', 'time'] },
  //{ label: 'is lesser than or equals', value: '<=', allowedTo: ['number', 'time'] },
  { label: 'is any of', value: '[]', multiValue: true },
  { label: 'is none of', value: '[!]', multiValue: true },
  { label: 'contains any of', value: '[%]', multiValue: true },
  { label: 'contains none of', value: '[!%]', multiValue: true },
  { label: 'starts with', value: '~_' },
  { label: 'ends with', value: '_~' },
  { label: 'starts with any of', value: '[~_]', multiValue: true },
  { label: 'ends with any of', value: '[_~]', multiValue: true },
  //{ label: 'is available', value: '~', allowedTo: [], noInput: true },
  //{ label: 'is not available', value: '!', allowedTo: [], noInput: true },
  { label: 'has some value', value: '*', noInput: true },
  { label: 'is empty', value: '-', noInput: true },
  { label: 'matches (regex)', value: '$' },
  { label: 'matches (wildcard)', value: '$*' }
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

export class ComparerList extends Component {
  constructor(props) {
    super(props);
    var fieldType = props.fieldType || 'string';
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
