import React, { Component } from 'react';
import { InputText } from 'primereact/inputtext';
import { Chips } from 'primereact/chips';

export default class UserInput extends Component {
  valueChanged = (e) => this.props.onChange(e.target.value);

  multiValueChanged = ({ value }) => this.props.onChange(value);

  getInputField() {
    const { multiValue, value } = this.props;

    if (multiValue) {
      return <Chips value={value || []} onChange={this.multiValueChanged} separator="," />
    }
    else {
      return <InputText value={value || ''} onChange={this.valueChanged} />;
    }

    /*switch ((this.props.inputType || '').toLowerCase()) {
      case 'int':
        return <InputText keyfilter="int" value={this.state.value} onChange={this.valueChanged} />;
      case 'num':
        return <InputText keyfilter="num" value={this.state.value} onChange={this.valueChanged} />;
      case 'array':
        return <InputText value={this.state.value} onChange={this.valueChanged} />;
      default:
        return <InputText value={this.state.value} onChange={this.valueChanged} />;
    }*/
  }

  render() {
    const { label = 'Value', size = 4 } = this.props;

    return (
      <div className={`p-md-${size}`}>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon">{label}</span>
          {this.getInputField()}
        </div>
      </div>
    );
  }
}
