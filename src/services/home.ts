import { SESSION_STORAGE_KEY } from '@/constant';
import request from '../utils/request';

const getSelectSql = (phone: string) => {
    return {
        "select_query": `select Full_Name, Phone, Fax, Email, Department, Title, Description from Contacts
                         where Phone = '${phone}'
                            or (((Home_Phone = '${phone}'
                            or Other_Phone = '${phone}')
                            or Mobile = '${phone}')
                            or Fax = '${phone}')
                        limit 1`
    }
}

export function getContact(params: string) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/coql`, {
        method: 'POST',
        body: JSON.stringify(getSelectSql(params)),
    })
}

const getAccountSql = (phone: string) => {
    return {
        "select_query": `select Account_Name, Phone, Fax, Industry, Description from Accounts where Phone = '${phone}' or Fax = '${phone}' limit 1`
    }
}

export function getAccount(params: string) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/coql`, {
        method: 'POST',
        body: JSON.stringify(getAccountSql(params)),
    })
}

const getLeadSql = (phone: string) => {
    return {
        "select_query": `select Full_Name, Phone, Fax, Email,Company, Designation, Description from Leads where Phone = '${phone}' or (Mobile = '${phone}' or Fax = '${phone}') limit 1`
    }
}

export function getLead(params: string) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/coql`, {
        method: 'POST',
        body: JSON.stringify(getLeadSql(params)),
    })
}

export function putCallInfo(params: LooseObject) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/Calls`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    });
}

/**
 * 创建联系人
 * @param params
 */
export function createContact(params: LooseObject) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/Contacts`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    });
}

/**
 * 创建Leads
 * @param params
 */
export function createLead(params: LooseObject) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/Leads`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    });
}

/**
 * 创建客户
 * @param params
 */
export function createAccount(params: LooseObject) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/Accounts`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        }
    });
}

/**
 * 获取联系人 by id
 * @param id
 */
export function getContactById(id: string) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/Contacts/${id}`);
}

/**
 * 获取客户 by id
 * @param id
 */
export function getAccountById(id: string) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/Accounts/${id}`);
}

/**
 * 获取Leads by id
 * @param id
 */
export function getLeadById(id: string) {
    const apiHost = sessionStorage.getItem(SESSION_STORAGE_KEY.apiHost);
    return request(`${apiHost}/crm/v2/Leads/${id}`);
}