/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from "react-dnd";

class Droppable extends PureComponent {
    render() {
        const { isOver, isOverCurrent, canDrop, connectDropTarget, children } = this.props;
        const isActive = isOverCurrent && canDrop;

        if (typeof children === "function") {
            return children(connectDropTarget, isOver, canDrop, isActive);
        }
        else {
            return connectDropTarget(children);
        }
    }
}

Droppable.propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired
};

const dropTarget = {
    canDrop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        } // This line is to handle drop event of nested components

        const { accepts, itemType: destItemType } = props;
        if (!accepts) { return true; }

        const { itemType, itemTarget } = monitor.getItem();
        if (destItemType === itemType || destItemType === itemTarget) { return true; }

        if (Array.isArray(itemTarget)) {
            if (!!~itemTarget.indexOf(destItemType)) { return true; }
        }

        if (Array.isArray(accepts)) {
            if (!!~accepts.indexOf(itemType)) { return true; }
        }
    },
    /*hover(props, monitor, component) {
        console.log("Droppable:dropTarget:hover ", props, monitor, component);
    },*/
    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        } // This line is to handle drop event of nested components

        const source = monitor.getItem();

        const { props: { index, onDrop, accepts, containerId } } = component;

        if (typeof source.onRemove === "function") {
            source.onRemove(source, containerId);
        }

        if (typeof onDrop === "function") {
            onDrop(source, { index, accepts });
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop()
    };
}

export default DropTarget(prop => prop.accepts, dropTarget, collect)(Droppable);