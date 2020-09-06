import React from 'react';
import BaseAction from './BaseAction';

class NoValuedAction extends BaseAction {
    static initItem(item) {
        return item;
    }

    renderAction() {
        return (
            <div>

            </div>
        );
    }
}

export default NoValuedAction;