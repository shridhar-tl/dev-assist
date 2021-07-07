export const FilterTypes = {
    FilterGroup: 'f_grp',
    Header: 'hdr',
    RequestMethod: 'rq_method',
    RequestType: 'rq_type',
    RequestOrigin: 'rq_origin',
    RequestProtocol: 'rq_protocol',
    RequestPort: 'rq_port',
    HostName: 'hostname',
    Initiator: 'initiator',
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

    ModifyResponseHeader: 'act_res_header',
    ModifyResponseCookies: 'act_res_cookie',

    AddCustomJS: 'act_cust_js',
    AddCustomCSS: 'act_cust_css',
    CloseTab: 'act_close_tab',

    ApplyProxy: 'act_aply_prxy',
    ShowNoti: 'act_noti_dflt'
};

export const Settings = {
    ExtensionEnabled: 'extensionEnabled'
};

export const ActionModifyItemType = {
    AddOrModify: 'add-modify',
    Add: 'add',
    Modify: 'modify',
    Remove: 'remove'
};

export const doubleDigitNonDomainNames = [
    'co', 'se', 'us', 'br', 'cn',
    'de', 'eu', 'gr', 'me', 'sa',
    'ru', 'se', 'uk', 'us', 'za'
];

export const tripleDigitNonDomainNames = ['net', 'org', 'gov', 'com', 'gen', 'jpn'];

export const Urls = {
    IssuesList: 'https://bitbucket.org/shridhartl/dev-assist/issues',
    Documentation: 'https://chrome.google.com/webstore/detail/dev-assistant/omjocblcimogflgejnnadnmbfmngblmd?hl=en',
    Donate: 'https://www.paypal.com/paypalme/shridhartl',
    Sourcecode: 'https://github.com/shridhar-tl/dev-assist'
};

export const MessageType = {
    Check: 'CHECK',
    ListIndexedDB: 'LIDB',
    ListIndexDBData: 'LIDBD',
    SaveIndexDBData: 'SIDD'
}
