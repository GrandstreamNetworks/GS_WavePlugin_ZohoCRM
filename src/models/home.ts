import { MODULES, REQUEST_CODE, ZOHO_CONFIG } from '@/constant';
import { createAccount, createContact, createLead, getAccount, getAccountById, getContact, getContactById, getLead, getLeadById, putCallInfo } from '@/services/home';
import { get } from 'lodash';
import { Effect, Reducer } from 'umi';

export interface HomeModelState {
}

export interface HomeModelType {
    namespace: 'home',
    state: HomeModelState
    effects: {
        getContact: Effect
        putCallInfo: Effect
        createNewContact: Effect
    }
    reducers: {
        save: Reducer<HomeModelState>
    }
}

const HomeModal: HomeModelType = {
    namespace: 'home',
    state: {},

    effects: {
        * getContact({ payload }, { call, put }) {
            let res = yield call(getContact, payload.callNum);
            // @ts-ignore
            pluginSDK.log.log(`getContact =====>: ${JSON.stringify(res)}`);
            let module = MODULES.contact;
            if (res?.status === REQUEST_CODE.noAuthority || res?.code === REQUEST_CODE.noAuthority) {
                // @ts-ignore
                pluginSDK.log.log(`getToken`);
                const getToken = yield put({
                    type: 'global/getToken',
                    payload: {
                        host: payload.host,
                        data: {
                            refresh_token: payload.refresh_token,
                            client_id: get(ZOHO_CONFIG, ['client_id', payload.host]),
                            client_secret: get(ZOHO_CONFIG, ['client_secret', payload.host]),
                            grant_type: 'refresh_token',
                        }
                    }
                });
                yield call(() => getToken);
                res = yield call(getContact, payload.callNum);
            }
            // 异常判断
            let connectState = res?.code || 'SUCCESS';
            yield put({
                type: 'global/save',
                payload: {
                    connectState,
                }
            })

            if (!res || !res.data) {
                module = MODULES.account;
                res = yield call(getAccount, payload.callNum);
            }
            if (!res || !res.data) {
                module = MODULES.lead;
                res = yield call(getLead, payload.callNum);
            }
            const contactInfo = get(res, 'data[0]') || {};
            contactInfo.Module = module;
            contactInfo.displayNotification = connectState === 'SUCCESS';
            return contactInfo;
        },

        * putCallInfo({ payload }, { call, put }) {
            const { callInfo, userConfig } = payload;
            let res = yield call(putCallInfo, callInfo);
            // @ts-ignore
            pluginSDK.log.log(`putCallInfo =====>: ${JSON.stringify(res)}`);
            if (res?.status === REQUEST_CODE.noAuthority) {
                const getToken = yield put({
                    type: 'global/getToken',
                    payload: {
                        host: userConfig.host,
                        data: {
                            refresh_token: userConfig.refresh_token,
                            client_id: get(ZOHO_CONFIG, ['client_id', userConfig.host]),
                            client_secret: get(ZOHO_CONFIG, ['client_id', userConfig.host]),
                            grant_type: 'refresh_token',
                        }
                    }
                });
                yield call(() => getToken);
                res = yield call(putCallInfo, callInfo);
            }
            let connectState = res?.code || 'SUCCESS';
            yield put({
                type: 'global/save', payload: { connectState, }
            })
            return res;
        },

        * createNewContact({ payload }, { call, put }) {
            const { contactInfo, attributesType } = payload;
            let res = null;
            let id;
            switch (attributesType) {
                case 'Leads':
                    res = yield call(createLead, contactInfo);
                    id = get(res, ['data', 0, 'details', 'id']);
                    if (id) {
                        res = yield call(getLeadById, id);
                    }
                    break
                case 'Accounts':
                    res = yield call(createAccount, contactInfo);
                    id = get(res, ['data', 0, 'details', 'id']);
                    if (id) {
                        res = yield call(getAccountById, id);
                    }
                    break
                default:
                    res = yield call(createContact, contactInfo);
                    id = get(res, ['data', 0, 'details', 'id']);
                    if (id) {
                        res = yield call(getContactById, id);
                    }
                    break
            }
            const result = get(res, ['data', 0]) || {}
            return {
                Full_Name: payload.contactInfo.First_Name + payload.contactInfo.Last_Name,
                id,
                ...result,
                Module: attributesType,
            }
        }
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload }
        }
    }
}

export default HomeModal;
