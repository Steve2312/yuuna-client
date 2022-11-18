import React from 'react'
import Download, { DownloadStatus } from '@/types/Download'
import styles from '@/styles/downloadcard.module.scss'
import getBackgroundImageStyle from '@/utils/BackgroundImageStyle'
import { FaTimes } from 'react-icons/fa'
import DownloadService from '@/services/DownloadService'

type Props = {
    download: Download,
    style: React.CSSProperties
}

const DownloadCard: React.FC<Props> = ({ download, style }) => {

    const cover = getBackgroundImageStyle(`https://assets.ppy.sh/beatmaps/${download.beatmap.id}/covers/list@2x.jpg`)

    const percentage = download.percentage?.toFixed(2) + '%'
    const percentageFormatted = download.percentage && download.status == DownloadStatus.Downloading ? ' : ' + percentage : ''

    const status = (): string => {
        switch (download.status) {
        case DownloadStatus.Waiting:
            return 'Waiting'
        case DownloadStatus.Initializing:
            return 'Initializing'
        case DownloadStatus.Downloading:
            return 'Downloading'
        case DownloadStatus.Importing:
            return 'Importing'
        case DownloadStatus.Failed:
            return 'Failed'
        default:
            return ''
        }
    }

    return (
        <div className={styles.downloadCard} style={style}>
            <div className={styles.cover} style={cover}>
                {
                    download.status != DownloadStatus.Initializing &&
                    download.status != DownloadStatus.Downloading &&
                    download.status != DownloadStatus.Importing &&
                    <FaTimes onClick={() => DownloadService.dequeue(download.beatmap)} />
                }
            </div>
            <div className={styles.content}>
                <span className={styles.artist}>{download.beatmap.artist}</span>
                <span className={styles.title}>{download.beatmap.title}</span>
                <span className={styles.status}>{status() + percentageFormatted}</span>
            </div>

        </div>
    )
}

export default DownloadCard