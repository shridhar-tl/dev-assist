import React, { PureComponent } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { filtersList, FILTERS_ADDED } from './filters';
import { groupedActions, ACTIONS_ADDED } from './actions';
import Draggable from '../../../components/drag-drop/Draggable';
import './Controls.scss';

class Controls extends PureComponent {

    renderFilters = (f, i) => (
        <Draggable key={f.id} index={i} itemType={f.type} item={f}
            containerId="filtersList" className="draggable" itemTarget={FILTERS_ADDED}>
            <span>{f.text}</span>
        </Draggable>
    );

    renderGroup = ({ key, values }) => (
        <div key={key} className="action-group">
            <div className="group-title">{key}</div>
            {values.map(this.renderAction)}
        </div>
    );

    renderAction = (action, i) => (
        <Draggable key={action.id} index={i} itemType={action.type} item={action}
            containerId="actionsList" className="draggable" itemTarget={ACTIONS_ADDED}>
            <span>{action.text}</span>
        </Draggable>
    );

    tabChanged = ({ index }) => this.props.onTabChanged(index);

    render() {
        const { tabIndex } = this.props;

        return (
            <div className="controls-panel">
                <TabView activeIndex={tabIndex} onTabChange={this.tabChanged}>
                    <TabPanel header="Filters">
                        <div className="draggable-list">
                            {filtersList.map(this.renderFilters)}
                        </div>
                    </TabPanel>
                    <TabPanel header="Actions">
                        <div className="draggable-list">
                            {groupedActions.map(this.renderGroup)}
                        </div>
                    </TabPanel>
                </TabView>
            </div>
        );
    }
}

export default Controls;