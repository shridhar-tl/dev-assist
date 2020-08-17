import array from "../../../../common/js-extn";
import NoValuedAction from "./NoValuedAction";

export const DRAG_TYPE_ACTION = 'ACTION_TO_ADD';
export const ACTIONS_ADDED = 'ACTION';

export const actionList = [
    { type: DRAG_TYPE_ACTION, id: 'act_bl_req', text: 'Block request', itemType: NoValuedAction, group: 'Modify Request', params: { infoText: 'Blocks this request' } },
    { type: DRAG_TYPE_ACTION, id: 'act_redr_req', text: 'Redirect request', itemType: NoValuedAction, group: 'Modify Request', params: { infoText: 'Redirect the request to given url' } },

    { type: DRAG_TYPE_ACTION, id: 'act_usr_agt', text: 'Modify user agent', itemType: NoValuedAction, group: 'Modify Request' },

    { type: DRAG_TYPE_ACTION, id: 'act_rep_host', text: 'Replace host or url', itemType: NoValuedAction, group: 'Modify Request' },
    { type: DRAG_TYPE_ACTION, id: 'act_rep_refr', text: 'Replace Referrer url', itemType: NoValuedAction, group: 'Modify Request' },

    { type: DRAG_TYPE_ACTION, id: 'act_add_qry', text: 'Add query param', itemType: NoValuedAction, group: 'Modify Request' },
    { type: DRAG_TYPE_ACTION, id: 'act_mod_qry', text: 'Modify query param', itemType: NoValuedAction, group: 'Modify Request' },
    { type: DRAG_TYPE_ACTION, id: 'act_rem_qry', text: 'Remove query param', itemType: NoValuedAction, group: 'Modify Request' },
    { type: DRAG_TYPE_ACTION, id: 'act_add_hdr', text: 'Add Header', itemType: NoValuedAction, group: 'Modify Request' },
    { type: DRAG_TYPE_ACTION, id: 'act_mod_hdr', text: 'Modify Header', itemType: NoValuedAction, group: 'Modify Request' },
    { type: DRAG_TYPE_ACTION, id: 'act_rem_hdr', text: 'Remove Header', itemType: NoValuedAction, group: 'Modify Request' },

    { type: DRAG_TYPE_ACTION, id: 'act_dumm_res', text: 'Send dummy response', itemType: NoValuedAction, group: 'Modify Response', params: { infoText: 'Send a fixed response for this request' } },
    { type: DRAG_TYPE_ACTION, id: 'act_add_cok', text: 'Add cookies', itemType: NoValuedAction, group: 'Modify Response' },
    { type: DRAG_TYPE_ACTION, id: 'act_mod_cok', text: 'Modify cookies', itemType: NoValuedAction, group: 'Modify Response' },
    { type: DRAG_TYPE_ACTION, id: 'act_rem_cok', text: 'Remove cookies', itemType: NoValuedAction, group: 'Modify Response' },
    { type: DRAG_TYPE_ACTION, id: 'act_cust_scr', text: 'Add custom script', itemType: NoValuedAction, group: 'Modify Response' },

    { type: DRAG_TYPE_ACTION, id: 'act_noti_dflt', text: 'Show notification', itemType: NoValuedAction, group: 'Other actions' },
    { type: DRAG_TYPE_ACTION, id: 'act_noti_cust', text: 'Custom notification', itemType: NoValuedAction, group: 'Other actions' },
    { type: DRAG_TYPE_ACTION, id: 'act_close_tab', text: 'Close tab', itemType: NoValuedAction, group: 'Other actions', params: { infoText: 'Close the tab from where this request was initiated' } }
];

export const actionMap = actionList.reduce((obj, action) => {
    const { id, itemType, text, params } = action

    obj[id] = { Control: itemType, title: text, params };

    return obj;
}, {});

export const groupedActions = array(actionList).groupBy('group')();