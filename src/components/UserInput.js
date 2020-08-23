import React, { Component } from 'react';
import { InputText } from 'primereact/components/inputtext/InputText';

export default class UserInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };

    this.valueChanged = this.valueChanged.bind(this);
  }

  valueChanged(e) {
    this.setState({ value: e.target.value });
    this.props.onChange(e.target.value);
  }

  getInputField() {
    switch ((this.props.inputType || '').toLowerCase()) {
      case 'int':
        return <InputText keyfilter="int" value={this.state.value} onChange={this.valueChanged} />;
      case 'num':
        return <InputText keyfilter="num" value={this.state.value} onChange={this.valueChanged} />;
      case 'array':
        return <InputText value={this.state.value} onChange={this.valueChanged} />;
      default:
        return <InputText value={this.state.value} onChange={this.valueChanged} />;
    }
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
