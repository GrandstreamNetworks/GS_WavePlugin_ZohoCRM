import { ConfigBlock, ConnectError, ConnectState, Footer } from '@/components';
import { ZOHO_CRM } from '@/constant';
import { get } from 'lodash';
import React from 'react';
import { GlobalModelState, connect, useIntl } from 'umi';
import styles from './index.less';

interface Props {
    userConfig: LooseObject
}

const HomePage: React.FC<Props> = ({ userConfig }) => {

    const { formatMessage } = useIntl();

    return (
        <>
            <ConnectError />
            <div className={styles.homePage}>
                <ConnectState />
                <ConfigBlock />
            </div>
            <Footer url={get(ZOHO_CRM, userConfig.host)} message={formatMessage({ id: 'home.toCRM' })} />
        </>
    )
}

export default connect(
    ({ global }: { global: GlobalModelState }) => ({
        userConfig: global.userConfig,
    })
)(HomePage);
