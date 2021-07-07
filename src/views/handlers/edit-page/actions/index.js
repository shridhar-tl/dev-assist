import array from "../../../../common/js-extn";
import { ActionTypes, FilterTypes } from "../../../../common/constants";
import CustomScriptAction from "./CustomScriptAction";
import ModifyItems from "./ModifyItems";
import NoValuedAction from "./NoValuedAction";
import ProxyAction from "./ProxyAction";
import UrlReplaceAction from "./UrlReplaceAction";
import UserAgentAction from "./UserAgentAction";
import { HeaderList } from "../../../../components";

export const DRAG_TYPE_ACTION = 'ACTION_TO_ADD';
export const ACTIONS_ADDED = 'ACTION';

export const actionList = [
    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.BlockRequest, text: 'Block request',
        itemType: NoValuedAction, group: 'Modify Request', params: { infoText: 'Blocks this request' },
        actions: {
            [ActionTypes.CloseTab]: true
        }
    },
    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.Redirectrequest, text: 'Redirect request',
        itemType: UrlReplaceAction, group: 'Modify Request', params: { infoText: 'Redirect the request to given url' },
        actions: {
            [ActionTypes.ModifyQueryParam]: true
        }
    },
    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.ModifyQueryParam, text: 'Modify query param',
        itemType: ModifyItems, group: 'Modify Request',
        actions: {
            [ActionTypes.CloseTab]: true
        }
    },
    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.ReplaceReferrer, text: 'Replace referrer url',
        itemType: UrlReplaceAction, group: 'Modify Request'
    },
    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.ModifyHeader, text: 'Modify request header',
        itemType: ModifyItems, group: 'Modify Request', params: { nameControl: HeaderList }
    },
    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.ModifyUserAgent, text: 'Modify user agent',
        itemType: UserAgentAction, group: 'Modify Request'
    },
    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.ModifyRequestCookie, text: 'Modify request cookies',
        itemType: ModifyItems, group: 'Modify Request'
    },

    /*
    {
        type: DRAG_TYPE_ACTION, id: 'act_dumm_res', text: 'Send dummy response',
        itemType: NoValuedAction, group: 'Modify Response', params: { infoText: 'Send a fixed response for this request' }
    },*/
    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.ModifyResponseHeader, text: 'Modify response header',
        itemType: ModifyItems, group: 'Modify Response', params: { nameControl: HeaderList }
    },
    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.ModifyResponseCookies, text: 'Modify response cookies',
        itemType: ModifyItems, group: 'Modify Response'
    },

    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.AddCustomJS, text: 'Add custom JS',
        itemType: CustomScriptAction, group: 'Tab Actions'
    },
    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.AddCustomCSS, text: 'Add custom CSS',
        itemType: CustomScriptAction, group: 'Tab Actions'
    },
    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.CloseTab, text: 'Close tab',
        itemType: NoValuedAction, group: 'Tab Actions',
        params: { infoText: 'Close the tab from where this request was initiated' }
    },

    {
        type: DRAG_TYPE_ACTION, id: ActionTypes.ApplyProxy, text: 'Apply proxy',
        itemType: ProxyAction, group: 'Other actions',
        actions: {
            [ActionTypes.CloseTab]: false
        },
        filters: {
            [FilterTypes.Header]: false,
            [FilterTypes.ReferrerUrl]: false
        }
    },
    /*{
        type: DRAG_TYPE_ACTION, id: ActionTypes.ShowNoti, text: 'Show notification',
        itemType: NoValuedAction, group: 'Other actions'
    },
    { type: DRAG_TYPE_ACTION, id: 'act_noti_cust', text: 'Custom notification', itemType: NoValuedAction, group: 'Other actions' }*/
];

export const actionMap = actionList.reduce((obj, action) => {
    const { id, itemType, text, params } = action

    obj[id] = { Control: itemType, title: text, params };

    return obj;
}, {});

export const groupedActions = array(actionList).groupBy('group')();