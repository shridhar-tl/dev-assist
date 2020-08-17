import React, { PureComponent } from 'react';
import Sortable from '../../components/drag-drop/Sortable';

class SortableContainer extends PureComponent {
    onAdded = (source, target) => {
        const { onChange } = this.props;
        let { items } = this.props;

        const { index, item: { id, itemType } } = source;

        const newItem = itemType.initItem({ id });

        items = [...items];
        items.splice(index, 0, newItem);

        onChange(items);
    }

    renderItem = (item, index, props) => {
        const { id } = item;
        const { Control: ItemControl, params } = this.props.mapper[id];

        return (<ItemControl key={index} index={index} item={item}
            dragConnector={props.dropConnector} onChange={this.itemChanged} {...params} />);
    }

    itemChanged = (item, index) => {
        const { onChange } = this.props;
        let { items } = this.props;

        items = [...items];
        items[index] = item;

        onChange(items);
    }

    render() {
        const { containerId, className, items, itemType, accepts, placeholder, onChange } = this.props;

        return (
            <Sortable containerId={containerId} className={"droppable " + className} items={items}
                itemType={itemType} accepts={accepts} placeholder={placeholder}
                onChange={onChange} onItemAdded={this.onAdded}>{this.renderItem}</Sortable>
        );
    }
}

export default SortableContainer;