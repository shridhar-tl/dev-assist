import React, { Component } from 'react';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';

const COMMON_COMPARERS = [
  { label: 'is equal to', value: '===', allowedTo: [] },
  { label: 'is not equal to', value: '!==', allowedTo: [] },
  { label: 'contains', value: '%', allowedTo: ['string'], valueType: 'array' },
  //{ label: 'is greater than', value: '>', allowedTo: ['number', 'time'] },
  //{ label: 'is greater than or equals', value: '>=', allowedTo: ['number', 'time'] },
  //{ label: 'is lesser than', value: '<', allowedTo: ['number', 'time'] },
  //{ label: 'is lesser than or equals', value: '<=', allowedTo: ['number', 'time'] },
  { label: 'is any of', value: '[]', allowedTo: [], valueType: 'array' },
  { label: 'contains any of', value: '[%]', allowedTo: [], valueType: 'array' },
  { label: 'starts with', value: '~_', allowedTo: ['string'] },
  { label: 'ends with', value: '_~', allowedTo: ['string'] },
  { label: 'starts with any of', value: '[~_]', allowedTo: ['string'] },
  { label: 'ends with any of', value: '[_~]', allowedTo: ['string'] },
  //{ label: 'is available', value: '~', allowedTo: [], noInput: true },
  //{ label: 'is not available', value: '!', allowedTo: [], noInput: true },
  { label: 'has some value', value: '*', allowedTo: [], noInput: true },
  { label: 'is empty', value: '-', allowedTo: [], noInput: true },
  { label: 'matches (regex)', value: '$', allowedTo: ['string'] },
  { label: 'matches (wildcard)', value: '$*', allowedTo: ['string'] }
];

export const comparerMap = COMMON_COMPARERS.reduce((obj, cur) => {
  obj[cur.value] = cur;
  return obj;
}, {});

export class ComparerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    var fieldType = props.fieldType || 'string';
    this.list = COMMON_COMPARERS.filter(i => (i.allowedTo || []).length === 0 || i.allowedTo.includes(fieldType));
  }

  selectionChanged = (e) => {
    this.setState({ value: e.value })
    this.props.onChange(e.value);
  }

  render() {
    const { label = 'Compare', size = 4 } = this.props;

    let control = (
      <Dropdown value={this.state.value} options={this.list} onChange={this.selectionChanged}
        style={{ width: '180px' }} placeholder="Choose a comparer" />
    );

    if (label) {
      control = (<div className="p-inputgroup"><span className="p-inputgroup-addon">{label}</span>{control}</div>);
    }

    return <div className={`p-md-${size}`}>{control}</div>;
  }
}

export default ComparerList;