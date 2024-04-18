import React from 'react';
import styles from './index.less'

interface Props {
    url: string
    message: string
}

const IndexPage: React.FC<Props> = ({ url, message }) => {

    const onClick = () => {
        window.open(url)
    }

    return (
        <div className={styles.footer}>
            <div onClick={onClick} className={styles.openUrl}>{message}</div>
        </div >
    )
}

export default IndexPage;