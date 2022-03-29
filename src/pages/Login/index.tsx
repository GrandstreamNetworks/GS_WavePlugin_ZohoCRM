import React, { useEffect, useState } from 'react';
import {
    connect,
    ConnectProps,
    Dispatch,
    history,
    Loading,
    useIntl,
} from 'umi';
import { Button, Checkbox, Form, Image, Input, Select } from 'antd';
import { REQUEST_CODE, SESSION_STORAGE_KEY, ZOHO_HOST } from '@/constant';
import SelectIcon from '../../asset/login/service-line.svg';
import IdIcon from '../../asset/login/account-line.svg';
import LockIcon from '../../asset/login/lock-line.svg';
import CodeIcon from '../../asset/login/code-line.svg';
import DownIcon from '../../asset/login/down.svg';
import CloseIcon from '../../asset/login/password-close.svg';
import OpenIcon from '../../asset/login/password-open.svg';
import styles from './index.less';

const { Option } = Select;

interface LoginProps extends ConnectProps {
    getToken: (obj: LooseObject) => Promise<LooseObject>;
    getUser: (obj: LooseObject) => Promise<LooseObject>;
    saveUserConfig: (obj: LooseObject) => void;
    loginLoading: boolean | undefined;
}

/**
 * 登录页
 */
const IndexPage: React.FC<LoginProps> = ({
    getToken,
    getUser,
    saveUserConfig,
    loginLoading,
}) => {
    const [remember, setRemember] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [form] = Form.useForm();
    const { formatMessage } = useIntl();

    /**
     * remember me 选框状态变化
     * @param e
     */
    const onCheckChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean) } }) => {
        setRemember(e.target.checked);
    };

    /**
     * 登录成功，页面跳转
     * 默认跳转home页
     */
    const loginSuccess = () => {
        history.replace({ pathname: '/home' });
    };

    /**
     * login：获取当前登录用户信息，调用getUser
     */
    const login = (userInfo: LooseObject) => {
        getUser(userInfo).then((res) => {
            if (res?.id) {
                saveUserConfig(userInfo);
                loginSuccess();
            } else {
                setErrorMessage('error.message');
            }
        });
    };

    const onfocus = () => {
        setErrorMessage('');
    };

    /**
     * 表单提交,获取token
     * getToken: 提交表单，获取token接口
     * token信息存储入store、sessionStorage
     * 调用wave接口，保存用户信息
     * 调用login方法
     * @param values {{host:string, client_id: string, client_secret:string, code:string}}
     */
    const onFinish = (values: LooseObject) => {
        sessionStorage.setItem(SESSION_STORAGE_KEY.host, values.host || 'US');
        const params = {
            ...values,
            grant_type: 'authorization_code',
        };
        getToken(params).then((res) => {
            if (res?.code === REQUEST_CODE.connectError) {
                setErrorMessage('error.network');
                return;
            }
            if (res?.status || res?.error) {
                setErrorMessage('error.message');
                return;
            }
            const userConfig = {
                ...res,
                ...values,
                client_id: values.client_id,
                client_secret: remember ? values.client_secret : undefined,
                code: remember ? values.code : undefined,
                autoLogin: remember,
                uploadCall: true,
            };
            login(userConfig);
        });
    };

    /**
     * 调用wave接口，获取用户信息
     * 实现自动登录
     */
    useEffect(() => {
        // @ts-ignore
        pluginSDK.userConfig.getUserConfig(function ({
            errorCode,
            data,
        }: {
            errorCode: number;
            data: string;
        }) {
            console.log(errorCode, data);
            if (errorCode === 0 && data) {
                const userInfo = JSON.parse(data);
                console.log(userInfo);
                form.setFieldsValue(userInfo);
                sessionStorage.setItem(SESSION_STORAGE_KEY.host, userInfo.host || 'US');
                sessionStorage.setItem(
                    SESSION_STORAGE_KEY.apiHost,
                    userInfo.api_domain,
                );
                sessionStorage.setItem(
                    SESSION_STORAGE_KEY.token,
                    userInfo.access_token,
                );
                if (userInfo.autoLogin) {
                    login(userInfo);
                }
            }
        });
    }, []);

    return (
        <>
            {errorMessage && (
                <div className={styles.errorDiv}>
                    <div className={styles.errorMessage}>
                        {formatMessage({ id: errorMessage })}
                    </div>
                </div>
            )}
            <div className={styles.homePage}>
                <Form
                    className={styles.form}
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFocus={onfocus}
                >
                    <Form.Item style={{ marginBottom: 0 }}>
                        <div className={styles.selectIcon}>
                            <Image src={SelectIcon} preview={false} />
                        </div>
                        <Form.Item
                            name="host"
                            rules={[
                                {
                                    required: true,
                                    message: formatMessage({ id: 'login.host.error' }),
                                },
                            ]}
                            initialValue="US"
                        >
                            <Select
                                placeholder={formatMessage({ id: 'login.host' })}
                                suffixIcon={<Image src={DownIcon} preview={false} />}
                            >
                                <Option value="US">{ZOHO_HOST.US}</Option>
                                <Option value="CN">{ZOHO_HOST.CN}</Option>
                                <Option value="EU">{ZOHO_HOST.EU}</Option>
                                <Option value="IN">{ZOHO_HOST.IN}</Option>
                                <Option value="AU">{ZOHO_HOST.AU}</Option>
                            </Select>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        name="client_id"
                        rules={[
                            {
                                required: true,
                                message: formatMessage({ id: 'login.client_id.error' }),
                            },
                        ]}
                    >
                        <Input
                            placeholder={formatMessage({ id: 'login.client_id' })}
                            prefix={<Image src={IdIcon} preview={false} />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="client_secret"
                        rules={[
                            {
                                required: true,
                                message: formatMessage({ id: 'login.client_secret.error' }),
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder={formatMessage({ id: 'login.client_secret' })}
                            prefix={<Image src={LockIcon} preview={false} />}
                            iconRender={(visible) =>
                                visible ? (
                                    <Image src={OpenIcon} preview={false} />
                                ) : (
                                    <Image src={CloseIcon} preview={false} />
                                )
                            }
                        />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: formatMessage({ id: 'login.code.error' }),
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder={formatMessage({ id: 'login.code' })}
                            prefix={<Image src={CodeIcon} preview={false} />}
                            iconRender={(visible) =>
                                visible ? (
                                    <Image src={OpenIcon} preview={false} />
                                ) : (
                                    <Image src={CloseIcon} preview={false} />
                                )
                            }
                        />
                    </Form.Item>
                    <div className={styles.remember}>
                        <Checkbox checked={remember} onChange={onCheckChange}>
                            {formatMessage({ id: 'login.remember' })}
                        </Checkbox>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loginLoading}>
                            {formatMessage({ id: 'login.submit' })}
                        </Button>
                    </Form.Item>
                    <div className={styles.footer}>
                        {formatMessage({ id: 'login.user.guide' })}
                    </div>
                </Form>
            </div>
        </>
    );
};

export default connect(
    ({ loading }: { loading: Loading }) => ({
        loginLoading:
            loading.effects['global/getUser'] || loading.effects['global/getToken'],
    }),
    (dispatch: Dispatch) => ({
        getToken: (payload: LooseObject) =>
            dispatch({
                type: 'global/getToken',
                payload,
            }),
        getUser: (payload: LooseObject) =>
            dispatch({
                type: 'global/getUser',
                payload,
            }),
        saveUserConfig: (payload: LooseObject) =>
            dispatch({
                type: 'global/saveUserConfig',
                payload,
            }),
    }),
)(IndexPage);
