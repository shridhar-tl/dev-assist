
export const FilterTypes = {
    FilterGroup: 'f_grp',
    Header: 'hdr',
    RequestType: 'rq_type',
    HostName: 'hostname',
    Url: 'url',
    ReferrerUrl: 'flt_refr_url',
    QueryParam: 'quer_param',
    DayOfWeek: 'dayOfWeek',
    TimeOfDay: 'timeOfDay',
    Attachment: 'attachment'
};

export const ActionTypes = {
    BlockRequest: 'act_bl_req',
    Redirectrequest: 'act_redr_req',
    ModifyUserAgent: 'act_usr_agt',
    ReplaceReferrer: 'act_rep_refr',
    ModifyQueryParam: 'act_mod_qry',
    ModifyHeader: 'act_mod_hdr',
    ModifyRequestCookie: 'act_req_cookie',

    ModifyResponseCookies: 'act_res_cookie',

    AddCustomScript: 'act_cust_scr',
    CloseTab: 'act_close_tab',

    ApplyProxy: 'act_aply_prxy',
    ShowNoti: 'act_noti_dflt'
};

export const ActionModifyItemType = {
    AddOrModify: '',
    Add: '',
    Modify: '',
    Remove: ''
};