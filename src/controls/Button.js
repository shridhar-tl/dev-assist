import React, { PureComponent } from "react";
import { Button as PrimeButton } from "primereact/button";

const buttonTypes = {
    danger: "p-button-danger",
    success: "p-button-success",
    secondary: "p-button-secondary",
    warning: "p-button-warning",
    info: "p-button-info",
    primary: "",
    default: ""
};

class Button extends PureComponent {
    render() {
        const { type, label, isLoading, icon, onClick, disabled, title, style } = this.props;
        let { className } = this.props;

        let btnClass = buttonTypes[type] || "";

        className = className || "";

        const props = { label, icon, onClick, disabled, title, style, className: `${btnClass} ${className}` };

        if (isLoading) {
            props.icon = "fa fa-spinner fa-spin";
        }

        if (!label) {
            delete props.label;
        }

        if (!icon) {
            delete props.icon;
        }

        return <PrimeButton {...props} />;
    }
}

export default Button;
