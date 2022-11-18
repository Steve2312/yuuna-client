import React, { CSSProperties } from 'react'
import styles from '@/styles/search-librarycard.module.scss'
import { FaCircleNotch, FaDownload, FaEllipsisH, FaPause, FaPlay, FaRedoAlt, FaTimes } from 'react-icons/fa'
import usePreviewService from '@/hooks/usePreviewService'
import PreviewService from '@/services/PreviewService'
import getBackgroundImageStyle from '@/utils/BackgroundImageStyle'
import formatSeconds from '@/utils/FormatSeconds'
import { openBeatmapPage, openCreatorPage } from '@/utils/Pages'
import Beatmap from '@/types/Beatmap'
import DownloadService from '@/services/DownloadService'
import classNames from '@/utils/ClassNames'
import useLibraryService from '@/hooks/useLibraryService'
import useDownloadService from '@/hooks/useDownloadService'
import { DownloadStatus } from '@/types/Download'
import ContextMenuService from '@/services/ContextMenuService'

type Props = {
    beatmap: Beatmap,
    index: number,
    style?: CSSProperties
}

const SearchCard: React.FC<Props> = React.memo(({ beatmap, index, style }) => {

    const [preview] = usePreviewService()
    const [library] = useLibraryService()
    const [download] = useDownloadService()

    const isPlaying = preview.beatmapSetID == beatmap.id && preview.playing
    const isLoading = preview.loading
    const isDownloaded = !!library.songs.find(song => song.beatmapset_id == beatmap.id)

    const status = download.downloads.find(download => download.beatmap.id == beatmap.id)?.status

    const cover = getBackgroundImageStyle(`https://assets.ppy.sh/beatmaps/${beatmap.id}/covers/list@2x.jpg`)
    const header = getBackgroundImageStyle(`https://assets.ppy.sh/beatmaps/${beatmap.id}/covers/card@2x.jpg`)

    const play = async (): Promise<void> => {
        if (preview.beatmapSetID === beatmap.id) PreviewService.playPause()
        else await PreviewService.playPreview(beatmap.id)
    }

    const statusIcon = (): JSX.Element => {
        switch (status) {
        case DownloadStatus.Waiting:
            return <FaTimes onClick={() => DownloadService.dequeue(beatmap)} />
        case DownloadStatus.Initializing:
            return <FaCircleNotch className={styles.loading} />
        case DownloadStatus.Downloading:
            return <FaCircleNotch className={styles.loading} />
        case DownloadStatus.Importing:
            return <FaCircleNotch className={styles.loading} />
        case DownloadStatus.Failed:
            return <FaRedoAlt onClick={() => DownloadService.download(beatmap)}/>
        default:
            return <FaDownload onClick={() => DownloadService.download(beatmap)}/>
        }
    }

    const buildContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        const buttons = [
            {
                label: isPlaying ? 'Pause' : 'Play',
                onClick: play
            },
            ...(!status ? [{
                label: 'Download',
                onClick: () => DownloadService.download(beatmap)
            }] : []),
            ...(status == DownloadStatus.Waiting || status == DownloadStatus.Failed ? [{
                label: 'Remove from download',
                onClick: () => DownloadService.dequeue(beatmap)
            }] : []),
            ...(status == DownloadStatus.Failed ? [{
                label: 'Retry download',
                onClick: () => DownloadService.download(beatmap)
            }] : []),
            {
                label: 'Visit ' + beatmap.creator,
                onClick: () => openCreatorPage(beatmap.creator)
            },
            {
                label: 'Open osu! beatmap page',
                onClick: () => openBeatmapPage(beatmap.id)
            }
        ]

        ContextMenuService.open(event, buttons)
    }

    return (
        <div className={styles.searchLibraryCard} style={style} onContextMenu={buildContextMenu}>
            <span className={styles.index}>{index + 1}</span>
            <div className={classNames({
                [styles.content]: true,
                [styles.playing]: preview.beatmapSetID == beatmap.id
            })}>
                <div className={styles.albumCover} style={cover}>
                    {
                        isPlaying ?
                            isLoading ?
                                <FaCircleNotch className={styles.loading} />
                                :
                                <FaPause onClick={play}/>
                            :
                            <FaPlay onClick={play}/>
                    }
                </div>
                <div className={styles.container} onDoubleClick={play}>
                    <div className={styles.cardCover} style={header} />
                    <div className={styles.section}>
                        <span className={styles.title}>{beatmap.title}</span>
                        <span className={styles.artist}>{beatmap.artist}</span>
                        <span className={styles.subject}>
                            SOURCE: <span className={styles.value}>{beatmap.source ? beatmap.source : '-'}</span>
                        </span>
                        <span className={styles.subject}>
                            CREATOR:{' '}
                            <span className={classNames({
                                [styles.value]: true,
                                [styles.link]: true
                            })} onClick={() => openCreatorPage(beatmap.creator)}>
                                {beatmap.creator}
                            </span>
                        </span>
                    </div>

                    <div className={styles.section}>
                        <span className={styles.box}>
                            DURATION: <span className={styles.value}>{formatSeconds(beatmap.average_length)}</span>
                        </span>
                        <span className={styles.box}>
                            BPM: <span className={styles.value}>{beatmap.bpm}</span>
                        </span>
                        <span className={styles.box}>
                            BEATMAP SET ID:{' '}
                            <span className={classNames({
                                [styles.value]: true,
                                [styles.link]: true
                            })} onClick={() => openBeatmapPage(beatmap.id)}>
                                {beatmap.id}
                            </span>
                        </span>
                    </div>
                </div>
                <div className={styles.options}>
                    { !isDownloaded && statusIcon() }
                    <FaEllipsisH />
                </div>
            </div>
        </div>
    )
}, () => true)

export default SearchCard