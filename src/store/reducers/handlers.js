import { Handler as actions } from '../action-types';
import array from '../../common/js-extn';

export default function (state = {}, { type, payload }) {
    switch (type) {
        case actions.SetList: return { ...state, list: payload };
        case actions.UpdateHandler: return updateHandler(state, payload);
        case actions.Save: return saveHandler(state, payload);

        default: return state;
    }
}

function updateHandler(state, payload) {
    const { id } = payload;
    const index = array(state.list).firstIndexOf(h => h.id === id);

    if (~index) {
        const newState = { ...state, list: [...state.list] };

        newState.list[index] = payload;
        return newState;
    }

    return state;
}

function saveHandler(state, payload) {
    const { id, name, desc, enabled, created, modified } = payload;
    const newHandler = { id, name, desc, enabled, created, modified };

    const list = (state.list?.length) ? state.list.filter(h => h.id !== id).concat(newHandler) : [newHandler];

    return { ...state, list };
}