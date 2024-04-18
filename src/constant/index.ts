const ZOHO_CONFIG = {
    client_id: {
        US: '1004.UGZGSBVOESHGPGPPGAQDG23B3GFRZD',
        CN: '1004.MWMMQWUP5EMH0ACILUK1X7JDQ1H9FX',
        EU: '1004.UGZGSBVOESHGPGPPGAQDG23B3GFRZD',
        IN: '1004.UGZGSBVOESHGPGPPGAQDG23B3GFRZD',
        AU: '1004.UGZGSBVOESHGPGPPGAQDG23B3GFRZD',
    },
    client_secret: {
        US: '040c7f8e3bcdfddc808138e01cde51b5ef090b8b35',
        CN: '97260f9164509d9c78431c6061b2b001eb9cc295f7',
        EU: '040c7f8e3bcdfddc808138e01cde51b5ef090b8b35',
        IN: '040c7f8e3bcdfddc808138e01cde51b5ef090b8b35',
        AU: '040c7f8e3bcdfddc808138e01cde51b5ef090b8b35',
    },
    scope: 'ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.users.ALL,ZohoCRM.coql.READ',
}

/**
 * zoho CRM 服务器地址
 * @type {{EU: string, AU: string, IN: string, CN: string, US: string}}
 */
const ZOHO_CRM = {
    US: 'https://crm.zoho.com',
    CN: 'https://crm.zoho.com.cn',
    EU: 'https://crm.zoho.eu',
    IN: 'https://crm.zoho.in',
    AU: 'https://crm.zoho.com.au',
};

/**
 * zoho CRM URL
 * @type {{create_address: string, contacts_address: string}}
 */
const ZOHO_CRM_ADDRESS = {
    Contacts: `/crm/tab/Contacts/`,
    Accounts: `/crm/tab/Accounts/`,
    Leads: `/crm/tab/Leads/`,
    create_address: `/crm/tab/Contacts/create`,
};

/**
 * zoho 服务器地址
 * @type {{EU: string, AU: string, IN: string, CN: string, US: string}}
 */
const ZOHO_HOST = {
    US: 'https://accounts.zoho.com',
    CN: 'https://accounts.zoho.com.cn',
    EU: 'https://accounts.zoho.eu',
    IN: 'https://accounts.zoho.in',
    AU: 'https://accounts.zoho.com.au',
};

/**
 * 全局消息弹窗属性
 * @type {{duration_2: number, duration_1: number, duration_0: number, success: string, warning: string, error: string, duration_5: number, timeout: string, duration_4: number, info: string, duration_3: number}}
 */
const GLOBAL_MESSAGE = {
    timeout: 'global_message_timeout',
    error: 'global_message_error',
    success: 'global_message_success',
    info: 'global_message_info',
    warning: 'global_message_warning',
    duration_0: 0,
    duration_1: 1,
    duration_2: 2,
    duration_3: 3,
    duration_4: 4,
    duration_5: 5,
};

const REQUEST_CODE = {
    ok: 200,
    created: 201,
    deleted: 204,
    dataError: 400,
    noAuthority: 401,
    noFound: 404,
    serverError: 500,
    gatewayError: 502,
    serverOverload: 503,
    serverTimeout: 504,
    connectError: 'CONNECT_ERROR',
    invalidToken: 'INVALID_TOKEN',
    reConnect: 'RECONNECT',
};

/**
 * sessionStorage key
 * @type {{apiHost: string, host: string, token: string}}
 */
const SESSION_STORAGE_KEY = {
    token: 'token',
    host: 'host',
    apiHost: 'apiHost',
};

/**
 * 监听wave事件key
 * @type {{recvP2PIncomingCall: string, answerP2PCall: string, rejectP2PCall: string, hangupP2PCall: string}}
 */
const EVENT_KEY = {
    recvP2PIncomingCall: 'onRecvP2PIncomingCall', // 收到来电
    answerP2PCall: 'onAnswerP2PCall', // 接听来电
    hangupP2PCall: 'onHangupP2PCall', // 挂断来电
    rejectP2PCall: 'onRejectP2PCall', // 拒接来电
    initP2PCall: 'onInitP2PCall', // wave发去呼叫
    p2PCallCanceled: 'onP2PCallCanceled', // 未接来电、去电
    initPluginWindowOk: 'onInitPluginWindowOk', //初始化窗口成功
    onViewCustomerInfos: 'onViewCustomerInfos' // 收到客户信息
};

const WAVE_CALL_TYPE = {
    in: 'Inbound',
    out: 'Outbound',
    miss: 'Missed',
};

const DATE_FORMAT = {
    format_1: 'YYYY/MM/DD',
    format_2: 'YYYY/MM/DD HH/mm/ss',
    format_3: 'YYYY-MM-DD HH-mm-ss',
    format_4: 'YYYY-MM-DDTHH:mm:ss+ssK',
    format_5: 'HH:mm:ss'
};

const MODULES = {
    contact: 'Contacts',
    account: 'Accounts',
    lead: 'Leads',
};

type CONFIG_SHOW = {
    None: null | undefined
    Name: string[],
    Phone: string,
    Fax: string,
    Email: string,
    Industry: string,
    Company: string,
    Title: string[],
    Department: string,
    Description: string,
}

const CONFIG_SHOW: CONFIG_SHOW = {
    None: undefined,
    Name: ['Full_Name', 'Account_Name'],
    Phone: "Phone",
    Fax: 'Fax',
    Email: 'Email',
    Industry: 'Industry',
    Company: 'Company',
    Title: ['Title', 'Designation'],
    Department: 'Department',
    Description: 'Description',
}

const NotificationConfig = {
    first: 'Information 1',
    second: 'Information 2',
    third: 'Information 3',
    forth: 'Information 4',
    fifth: 'Information 5'
}

const NOTIFICATION_CONFIG_DEF = {
    first: 'Name',
    second: 'Phone',
    third: 'None',
    forth: 'None',
    fifth: 'None',
}

const AUTO_CREATE_CONFIG_DEF = {
    numberType: 'Wave',
    direction: 'All',
    entityType: 'Contact',
    firstName: 'Wave [Number]',
    lastName: 'New',
}

const UPLOAD_CALL_CONFIG_DEF = {
    subject: 'Wave PhoneSystem Call',
    Inbound: '[DateTime]: Incoming call from [Number] [Name] to [Agent]([Duration])',
    Missed: '[DateTime]: Missed call from [Number] [Name] to [Agent]',
    Outbound: '[DateTime]: Outgoing call from [Agent] to [Number] [Name] ([Duration])',
    unansweredOutbound: '[DateTime]: Unanswered outgoing call from [Agent] to [Number] [Name]'
}

const CREATION_CONFIG_CONTACT_TYPE = [
    'Contact', 'Lead', 'Account'
]

export {
    AUTO_CREATE_CONFIG_DEF, CONFIG_SHOW, CREATION_CONFIG_CONTACT_TYPE, DATE_FORMAT, EVENT_KEY, GLOBAL_MESSAGE, MODULES,
    NOTIFICATION_CONFIG_DEF, NotificationConfig, REQUEST_CODE,
    SESSION_STORAGE_KEY, UPLOAD_CALL_CONFIG_DEF, WAVE_CALL_TYPE, ZOHO_CONFIG,
    ZOHO_CRM,
    ZOHO_CRM_ADDRESS,
    ZOHO_HOST
};

