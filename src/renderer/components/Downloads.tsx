import React, { useState } from 'react';
import styles from '@/styles/downloads.module.scss';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import List from '@/components/List';
import useDownloadService from '@/hooks/useDownloadService';
import DownloadCard from '@/components/DownloadCard';
import classNames from '@/utils/ClassNames';

const Downloads: React.FC = () => {
    const [download] = useDownloadService();
    const [visibility, setVisibility] = useState<boolean>(true);

    const activeDownloads = download.downloads.filter(download => download.status != 'Failed').length;

    const toggle = (): void => {
        setVisibility(visibility => !visibility);
    };

    return (
        <div className={classNames({
            [styles.downloads]: true,
            [styles.hidden]: !visibility
        })}>
            <div className={styles.header}>
                <span className={styles.icon} onClick={toggle}>
                    {
                        visibility
                            ?
                            <FaArrowRight/>
                            :
                            <FaArrowLeft />
                    }
                </span>

                <div className={styles.content}>
                    <h1>Downloads</h1>
                    <p>Active downloads: {activeDownloads}</p>
                </div>
            </div>
            <List
                className={styles.list}
                prerenderCount={7}
                componentHeight={45}
                spaceBetween={15}
                keyExtractor={(data) => data.beatmap.id}
                data={download.downloads}
                render={
                    ({ data, style }) => {
                        return (
                            <DownloadCard download={data} style={style}/>
                        );
                    }
                } />
        </div>
    );
};

export default Downloads;