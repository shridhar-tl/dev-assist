import { Settings as actions } from '../action-types';

export default function (state = {}, { type, payload }) {
    if (type === actions.UpdateSetting) {

        const { key, value } = payload;

        return { ...state, [key]: value };
    }
    else if (type === actions.LoadSettings) {
        return { ...state, ...payload };
    }

    return state;
}