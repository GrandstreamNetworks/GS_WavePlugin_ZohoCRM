import { REQUEST_CODE, SESSION_STORAGE_KEY, ZOHO_CONFIG } from '@/constant';
import { getDeviceCode, getDeviceToken, getToken, getUser, revokeToken } from '@/services/global';
import { get } from 'lodash';
import { Effect, Reducer, history } from 'umi';

export interface GlobalModelState {
    user: LooseObject
    userConfig: LooseObject
    connectState: string
    tokenInfo: LooseObject
    host: string
}

export interface GlobalModelType {
    namespace: 'global'
    state: GlobalModelState
    effects: {
        getUser: Effect
        getToken: Effect
        getDeviceCode: Effect
        getDeviceToken: Effect
        saveUserConfig: Effect
        userConfigChange: Effect
        logout: Effect
    }
    reducers: {
        save: Reducer<GlobalModelState>
    }
}

const GlobalModal: GlobalModelType = {
    namespace: 'global',
    state: {
        user: {},
        userConfig: {},
        connectState: 'SUCCESS',
        tokenInfo: {},
        host: '',
    },

    effects: {
        * getUser({ payload }, { call, put }) {
            let res = yield call(getUser);
            // @ts-ignore
            pluginSDK.log.log(`getUser===> ${JSON.stringify(res)}`);
            if (res?.status === REQUEST_CODE.noAuthority) {
                const getToken = yield put({
                    type: 'getToken',
                    payload: {
                        host: payload.host,
                        data: {
                            refresh_token: get(payload, ['tokenInfo', 'refresh_token']),
                            client_id: get(ZOHO_CONFIG, ['client_id', payload.host]),
                            client_secret: get(ZOHO_CONFIG, ['client_secret', payload.host]),
                            grant_type: 'refresh_token',
                        }
                    }
                });
                yield call(() => getToken);
                res = yield call(getUser);
            }
            let connectState = res?.code || 'SUCCESS';
            const user = get(res, 'users[0]') || {};
            if (user.id) {
                yield put({
                    type: 'save',
                    payload: {
                        user,
                        connectState,
                    },
                });
            }
            else {
                yield put({
                    type: 'save',
                    payload: {
                        connectState,
                    },
                });
            }
            return user;
        },

        * getToken({ payload }, { call, put }) {
            const res = yield call(getToken, payload);
            // @ts-ignore
            pluginSDK.log.log(`getToken===> ${JSON.stringify(res)}`);
            let connectState = res?.code || 'SUCCESS';
            yield put({
                type: 'save',
                payload: {
                    connectState: connectState,
                }
            })
            sessionStorage.setItem(SESSION_STORAGE_KEY.token, get(res, 'access_token'));
            return res;
        },

        * getDeviceCode({ payload }, { call }) {
            return yield call(getDeviceCode, payload);
        },

        * getDeviceToken({ payload }, { call }) {
            const res = yield call(getDeviceToken, payload);
            // @ts-ignore
            pluginSDK.log.log(`getDeviceToken===> ${JSON.stringify(res)}`);
            if (res?.access_token) {
                sessionStorage.setItem(SESSION_STORAGE_KEY.apiHost, get(res, 'api_domain'));
                sessionStorage.setItem(SESSION_STORAGE_KEY.token, res.access_token,);
            }
            return res || {};
        },

        * logout(_, { call, put, select }) {
            const { userConfig } = yield select((state: any) => state.global);
            userConfig.autoLogin = false;
            yield put({
                type: 'saveUserConfig',
                payload: userConfig
            });
            yield call(revokeToken, {
                host: userConfig.tokenInfo.host,
                token: userConfig.tokenInfo.refresh_token,
            });
            history.replace({ pathname: 'auth' })
        },

        * userConfigChange({ payload }, { put, select }) {
            const { userConfig } = yield select((state: any) => state.global);
            const newConfig = {
                ...userConfig,
                ...payload,
            }
            yield put({
                type: 'saveUserConfig',
                payload: newConfig,
            })
        },

        * saveUserConfig({ payload }, { put }) {
            console.log(payload);
            // @ts-ignore
            pluginSDK.userConfig.addUserConfig({ userConfig: JSON.stringify(payload) }, function ({ errorCode }: {
                errorCode: number
            }) {
                console.log(errorCode);
            })
            yield put({
                type: 'save',
                payload: {
                    userConfig: payload
                },
            })
        }
    },

    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        },
    },
}

export default GlobalModal;