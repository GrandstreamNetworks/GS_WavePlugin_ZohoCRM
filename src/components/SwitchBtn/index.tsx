import React from 'react';
import { Switch } from 'antd';
import { connect, GlobalModelState, Dispatch } from 'umi';
import styles from './index.less'

interface Props {
    userConfig: LooseObject
    connectState: string
    saveUserConfig: (obj: LooseObject) => void
}

const IndexPage: React.FC<Props> = ({ userConfig, saveUserConfig, connectState }) => {

    const onSwitchChange = (checked: boolean) => {
        const config = JSON.parse(JSON.stringify(userConfig));
        config.uploadCall = checked;
        saveUserConfig(config)
    }

    return (
        <div className={styles.switch}>
            <Switch
                checked={userConfig.uploadCall}
                onChange={onSwitchChange}
                disabled={connectState !== 'SUCCESS'} />
        </div>
    )
}

export default connect(
    ({ global }: { global: GlobalModelState }) => ({
        userConfig: global.userConfig,
        connectState: global.connectState,
    }),
    (dispatch: Dispatch) => ({
        saveUserConfig: (payload: LooseObject) =>
            dispatch({
                type: 'global/saveUserConfig',
                payload,
            })
    })
)(IndexPage);