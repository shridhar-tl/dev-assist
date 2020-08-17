import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Draggable from './Draggable';
import Droppable from './Droppable';

let globalContainerId = 0;
class Sortable extends PureComponent {
    constructor(props) {
        super(props);
        this.containerId = ++globalContainerId;
    }

    handleDrop = (source, target) => {
        const { itemType: sourceItemType, item: sourceItem } = source;
        const { items, onChange, itemType, onItemAdded } = this.props;

        if (itemType !== sourceItemType) {
            if (typeof onItemAdded === "function") {
                onItemAdded(source, target);
            }
            return;
        }

        const newArr = [...items];

        let removedItem = sourceItem;
        if (source.containerId === this.containerId) {
            [removedItem] = newArr.splice(source.index, 1);
        }

        let targetIndex = target.index;
        if (targetIndex >= newArr.length) {
            newArr.push(removedItem);
        }
        else {
            newArr.splice(targetIndex, 0, removedItem);
        }

        onChange(newArr);
    }

    handleRemove = (source, targetId) => {
        if (this.containerId === targetId || this.props.nonRemovable === true) {
            return;
        }

        const { items, onChange } = this.props;

        const newArr = [...items];

        const [sourceItem] = newArr.splice(source.index, 1);
        onChange(newArr);

        return sourceItem;
    }

    renderItem = (c, i, itemTemplate) => {
        const { containerId, props: { itemType, accepts = itemType, keyName, draggableClassName, itemTarget, useDragHandle } } = this;

        return <Droppable containerId={containerId} key={keyName ? c[keyName] : i} accepts={accepts} itemType={itemType} index={i} onDrop={this.handleDrop}>
            {(dropConnector, isOver, canDrop) => <Draggable containerId={containerId} className={draggableClassName} itemTarget={itemTarget}
                itemType={itemType} item={c} index={i} onRemove={this.handleRemove}>
                {useDragHandle ?
                    (dragHandle, isDragging) => itemTemplate(c, i, { dropConnector, isOver, canDrop }, { dragHandle, isDragging })
                    : itemTemplate(c, i, { dropConnector, isOver, canDrop })
                }
            </Draggable>}
        </Droppable>
    }

    renderItems = (itemTemplate) => {
        const { props: { items } } = this;

        return items.map((c, i) => this.renderItem(c, i, itemTemplate));
    }

    renderChildren = (c, i) => {
        const { props: { children } } = this;

        return this.renderItem(c, i, children);
    }

    getDropableContainer = (toRender, itemsCount) => {
        let itemsToRender = toRender;

        if (typeof itemsToRender === 'string') {
            itemsToRender = (connectDrag, isOver, canDrop, isActive) => {
                const className = classNames(
                    'drop-placeholder',
                    {
                        'non-empty': itemsCount > 0,
                        'drop-hover': canDrop && isOver,
                        'drop-enabled': canDrop && !isOver,
                        'drop-disabled': isActive && !canDrop
                    }
                );

                return connectDrag(<div className={className}>{toRender}</div>);
            }
        }

        const { containerId, props: { items, itemType, accepts = itemType } } = this;

        return <Droppable containerId={containerId} accepts={accepts} itemType={itemType}
            index={items.length} onDrop={this.handleDrop}>
            {itemsToRender}
        </Droppable>;
    }

    render() {
        const { props: { useCustomContainer, items, children, className, placeholder } } = this;

        let itemsToRender = null;
        if (useCustomContainer) {
            if (typeof children !== "function") {
                throw new Error("When useCustomContainer=true, children must be a function");
            }

            itemsToRender = this.getDropableContainer((connectDropTarget, isOver, canDrop, isActive) => connectDropTarget(children(this.renderItems, { isOver, canDrop, isActive })));
        }
        else if (items && items.length > 0) {
            itemsToRender = <div className={className}>{items.map(this.renderChildren)}
                {placeholder && this.getDropableContainer(placeholder, items.length)}
            </div>;
        }
        else {
            itemsToRender = this.getDropableContainer(placeholder, 0);
        }

        return itemsToRender;
    }
}

Sortable.propTypes = {
    items: PropTypes.array.isRequired,
    children: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onItemAdded: PropTypes.func,
    nonRemovable: PropTypes.bool
};

export default Sortable;