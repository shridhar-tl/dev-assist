import { Handler as actions } from '../action-types';
import array from '../../common/js-extn';

export default function (state = {}, { type, payload }) {
    switch (type) {
        case actions.SetList: return { ...state, list: payload, importHandler: null };
        case actions.SetActiveHandlers: return { ...state, ...payload };
        case actions.UpdateHandler: return updateHandler(state, payload);
        case actions.Save: return saveHandler(state, payload);
        case actions.Delete: return deleteHandler(state, payload);
        case actions.ImportHandler: return { ...state, importHandler: payload };
        case actions.ClearImport: return { ...state, importHandler: null };

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

function saveHandler(state, newHandler) {
    const { id } = newHandler;

    const list = (state.list?.length)
        ? state.list.filter(h => h.id !== id).concat(newHandler)
        : [newHandler];

    return { ...state, list };
}


function deleteHandler(state, ids) {
    const list = Array.isArray(ids)
        ? state.list.filter(h => !ids.includes(h.id))
        : state.list.filter(h => h.id !== ids);

    return { ...state, list };
}
