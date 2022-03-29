import React, { useEffect, useRef } from 'react';
import { connect, Dispatch, GlobalModelState, history, useIntl } from 'umi';
import { Button, Col, Row } from 'antd';
import { get } from 'lodash';
import moment from 'moment';
import { getNotificationBody } from '@/utils/utils';
import { ConnectError, ConnectState, Footer, SwitchBtn } from '@/components';
import { EVENT_KEY, MODULES, WAVE_CALL_TYPE, ZOHO_CRM, ZOHO_CRM_ADDRESS } from '@/constant';
import styles from './index.less'

interface HomeProps {
    getContact: (obj: LooseObject) => Promise<LooseObject>
    putCallInfo: (obj: LooseObject) => Promise<LooseObject>
    logout: (obj: LooseObject) => void
    saveUserConfig: (obj: LooseObject) => void
    userConfig: LooseObject
}

type Who = {
    id: string
    name: string
}

type CallParams = {
    Call_Purpose: string
    Call_Start_Time: string
    Subject: string
    Call_Type: string
    $se_module: string
    Dialled_Number?: string
    Call_Duration?: string | number
    Call_Duration_in_seconds?: number
    Call_Result?: string
    Call_Status?: string
    Who_Id?: Who
    What_Id?: Who
    Description?: string,
}

const HomePage: React.FC<HomeProps> = (props) => {
    const {
        getContact,
        putCallInfo,
        logout,
        saveUserConfig,
        userConfig,
    } = props;
    const { formatMessage } = useIntl();

    const callNumber = useRef(null);

    /**
     * 登出
     */
    const logoutClick = () => {
        const config = JSON.parse(JSON.stringify(userConfig));
        config.autoLogin = false;
        saveUserConfig(config);
        logout({
            host: config.host,
            token: config.refresh_token,
        });
        history.replace({ pathname: 'auth' })
    };

    /**
     * 上报通话
     */
    const uploadCallInfo = (callNum: string, callStartTimeStamp: number, callEndTimeStamp: number, callDirection: string) => {
        if (!userConfig.uploadCall) {
            return;
        }
        callNum = callNum.replace(/\b(0+)/gi, '');
        getContact({ callNum, ...userConfig }).then(contactInfo => {
            if (!contactInfo?.id) {
                return;
            }
            const duration = callEndTimeStamp - callStartTimeStamp;
            const duration_minutes = moment.duration(duration).hours() * 60 + moment.duration(duration).minutes()
            const duration_seconds = moment.duration(duration).seconds();
            const data: CallParams = {
                Call_Purpose: '-None-',
                Call_Start_Time: moment(callStartTimeStamp || undefined).format(),
                Subject: `${contactInfo.Full_Name || contactInfo?.Account_Name} 's call.`,
                Call_Type: callDirection,
                $se_module: contactInfo?.Module,
                Dialled_Number: callNum,
                Call_Duration: `${duration_minutes}:${duration_seconds}`,
                Call_Duration_in_seconds: moment.duration(duration).asSeconds()
            }
            if (contactInfo?.Module === MODULES.contact) {
                data.Who_Id = {
                    id: contactInfo.id,
                    name: contactInfo.Full_Name,
                }
            } else {
                data.What_Id = {
                    id: contactInfo.id,
                    name: contactInfo.Full_Name,
                }
            }
            const params = {
                callInfo: {
                    data: [data]
                },
                userConfig,
            };
            putCallInfo(params).then(res => {
                console.log('putCallInfo:', params, res);
            });
        })
    }

    const getUrl = (contact: LooseObject) => {
        const zoho_crm_host = get(ZOHO_CRM, userConfig.host);
        return contact?.id ? zoho_crm_host + get(ZOHO_CRM_ADDRESS, contact?.Module) + contact.id : zoho_crm_host + ZOHO_CRM_ADDRESS.create_address;
    }

    const initCallInfo = (callNum: string) => {
        // callNum 去除前面的0
        callNum = callNum.replace(/\b(0+)/gi, '');
        getContact({ callNum, ...userConfig, }).then(contact => {
            if (!contact?.displayNotification) {
                return;
            }
            const url = getUrl(contact);
            const name = contact?.Full_Name || contact?.Account_Name;
            const department = contact?.Department;
            const title = contact?.Title;
            const job = department && title ? department + '|' + title : department || title;
            const pluginPath = sessionStorage.getItem('pluginPath');
            const body = {
                logo: `<div style="margin-bottom: 12px"><img src="${pluginPath}/zoho.svg" alt=""/> ZohoCRM</div>`,
                info: name ? `<div style="font-weight: bold; text-overflow: ellipsis; white-space:nowrap; overflow: hidden">${name}</div>` : null,
                PhoneNumber: `<div style="font-weight: bold; text-overflow: ellipsis; white-space:nowrap; overflow: hidden">${callNum}</div>`,
                title: job ? `<div style="font-weight: bold; text-overflow: ellipsis; white-space:nowrap; overflow: hidden">${job}</div>` : null,
                action: `<div style="margin-top: 10px;display: flex;justify-content: flex-end;"><button style="background: none; border: none;">
                             <a href=${url} target="_blank" style="color: #62B0FF">
                                 ${contact?.id ? formatMessage({ id: 'home.detail' }) : formatMessage({ id: 'home.edit' })}
                             </a>
                         </button></div>`
            }
            console.log('displayNotification');
            // @ts-ignore
            pluginSDK.displayNotification({
                notificationBody: getNotificationBody(body),
            })

        })
    }

    useEffect(() => {
        // @ts-ignore
        pluginSDK.eventEmitter.on(EVENT_KEY.recvP2PIncomingCall, function ({ callType, callNum }) {
            console.log('onRecvP2PIncomingCall', callType, callNum);
            callNumber.current = callNum;
            initCallInfo(callNum);
        });

        // @ts-ignore
        pluginSDK.eventEmitter.on(EVENT_KEY.initP2PCall, function ({ callType, callNum }) {
            console.log('onInitP2PCall', callType, callNum);
            callNumber.current = callNum;
            initCallInfo(callNum);
        })

        // @ts-ignore
        pluginSDK.eventEmitter.on(EVENT_KEY.rejectP2PCall, function ({ callType, callNum }) {
            console.log('onRejectP2PCall', callType, callNum);
            uploadCallInfo(callNum, 0, 0, WAVE_CALL_TYPE.in);
            if (callNum === callNumber.current) {
                // @ts-ignore
                pluginSDK.hideNotification();
            }
        });

        // @ts-ignore
        pluginSDK.eventEmitter.on(EVENT_KEY.p2PCallCanceled, function ({ callType, callNum }) {
            console.log('p2PCallCanceled', callType, callNum);
            uploadCallInfo(callNum, 0, 0, WAVE_CALL_TYPE.miss);
            if (callNum === callNumber.current) {
                // @ts-ignore
                pluginSDK.hideNotification();
            }
        })

        // @ts-ignore
        pluginSDK.eventEmitter.on(EVENT_KEY.hangupP2PCall, function (data) {
            let { callType, callNum, callStartTimeStamp, callEndTimeStamp, callDirection } = data
            console.log('onHangupP2PCall', callType, callNum, callStartTimeStamp, callEndTimeStamp, callDirection);
            callDirection = callDirection === 'in' ? WAVE_CALL_TYPE.in : WAVE_CALL_TYPE.out;
            uploadCallInfo(callNum, callStartTimeStamp ?? 0, callEndTimeStamp ?? 0, callDirection);
            if (callNum === callNumber.current) {
                // @ts-ignore
                pluginSDK.hideNotification();
            }
        });

        return function cleanup() {
            // @ts-ignore
            pluginSDK.eventEmitter.off(EVENT_KEY.recvP2PIncomingCall);
            // @ts-ignore
            pluginSDK.eventEmitter.off(EVENT_KEY.initP2PCall);
            // @ts-ignore
            pluginSDK.eventEmitter.off(EVENT_KEY.rejectP2PCall);
            // @ts-ignore
            pluginSDK.eventEmitter.off(EVENT_KEY.p2PCallCanceled);
            // @ts-ignore
            pluginSDK.eventEmitter.off(EVENT_KEY.hangupP2PCall);
        }
    }, [userConfig])

    return (
        <>
            <ConnectError />
            <div className={styles.homePage}>
                <ConnectState />
                <div className={styles.callConfig}>
                    <Row>
                        <Col span={19}>
                            <span className={styles.spanLabel}>{formatMessage({ id: 'home.Synchronize' })}</span>
                        </Col>
                        <Col span={4}>
                            <SwitchBtn />
                        </Col>
                    </Row>
                </div>
                <Button onClick={logoutClick}>{formatMessage({ id: 'home.logout' })}</Button>
            </div>
            <Footer url={get(ZOHO_CRM, userConfig.host)} message={formatMessage({ id: 'home.toCRM' })} />
        </>
    )
}

export default connect(
    ({ global }: { global: GlobalModelState }) => ({
        userConfig: global.userConfig,
    }),
    (dispatch: Dispatch) => ({
        getContact: (payload: LooseObject) =>
            dispatch({
                type: 'home/getContact',
                payload,
            }),
        putCallInfo: (payload: LooseObject) =>
            dispatch({
                type: 'home/putCallInfo',
                payload
            }),
        logout: (payload: LooseObject) =>
            dispatch({
                type: 'global/logout',
                payload,
            }),
        saveUserConfig: (payload: LooseObject) =>
            dispatch({
                type: 'global/saveUserConfig',
                payload,
            }),
    })
)(HomePage);
