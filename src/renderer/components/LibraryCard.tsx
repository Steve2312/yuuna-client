import React, { CSSProperties } from 'react'
import styles from '@/styles/search-librarycard.module.scss'
import { FaPlay, FaPause, FaEllipsisH } from 'react-icons/fa'
import Song from '@/types/Song'
import { getCoverPath, getHeaderPath } from '@/utils/Paths'
import getBackgroundImageStyle from '@/utils/BackgroundImageStyle'
import PlayerService from '@/services/PlayerService'
import LibraryService from '@/services/LibraryService'
import usePlayerService from '@/hooks/usePlayerService'
import formatSeconds from '@/utils/FormatSeconds'
import { openBeatmapPage, openCreatorPage } from '@/utils/Pages'
import classNames from '@/utils/ClassNames'
import ContextMenuService from '@/services/ContextMenuService'

type Props = {
    song: Song,
    style?: CSSProperties
}

const LibraryCard: React.FC<Props> = React.memo<Props>(({ song, style }) => {

    const [player] = usePlayerService()

    const coverPath = getCoverPath(song)
    const headerPath = getHeaderPath(song)

    const isPlaying = player.current?.id == song.id && player.playing

    const play = async (): Promise<void> => {
        await PlayerService.playFromPlaylist('', LibraryService.getState().songs, song.index)
    }

    const buildContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        const buttons = [
            {
                label: isPlaying ? 'Pause' : 'Play',
                onClick: play
            },
            {
                label: 'Visit ' + song.creator,
                onClick: () => openCreatorPage(song.creator)
            },
            {
                label: 'Open osu! beatmap page',
                onClick: () => openBeatmapPage(song.beatmapset_id)
            },
            {
                label: 'Delete song',
                onClick: play
            }
        ]

        ContextMenuService.open(event, buttons)
    }

    return (
        <div className={styles.searchLibraryCard} style={style} onContextMenu={buildContextMenu}>
            <span className={styles.index}>{song.index + 1}</span>
            <div className={classNames({
                [styles.content]: true,
                [styles.playing]: player.current?.id == song.id
            })}>
                <div className={styles.albumCover} style={getBackgroundImageStyle(coverPath)}>
                    {
                        isPlaying ?
                            <FaPause onClick={play}/>
                            :
                            <FaPlay onClick={play}/>
                    }
                </div>
                <div className={styles.container} onDoubleClick={play}>
                    <div className={styles.cardCover} style={getBackgroundImageStyle(headerPath)} />
                    <div className={styles.section}>
                        <span className={styles.title}>{song.title}</span>
                        <span className={styles.artist}>{song.artist}</span>
                        <span className={styles.subject}>
                            SOURCE: <span className={styles.value}>{song.source ? song.source : '-'}</span>
                        </span>
                        <span className={styles.subject}>
                            CREATOR:{' '}
                            <span className={classNames({
                                [styles.value]: true,
                                [styles.link]: true
                            })} onClick={() => openCreatorPage(song.creator)}>
                                {song.creator}
                            </span>
                        </span>
                    </div>

                    <div className={styles.section}>
                        <span className={styles.box}>
                            DURATION: <span className={styles.value}>{formatSeconds(song.duration)}</span>
                        </span>
                        <span className={styles.box}>
                            BPM: <span className={styles.value}>{song.bpm}</span>
                        </span>
                        <span className={styles.box}>
                            BEATMAP SET ID:{' '}
                            <span className={classNames({
                                [styles.value]: true,
                                [styles.link]: true
                            })} onClick={() => openBeatmapPage(song.beatmapset_id)}>
                                {song.beatmapset_id}
                            </span>
                        </span>
                    </div>
                </div>
                <div className={styles.options}>
                    <br/>
                    <FaEllipsisH />
                </div>
            </div>
        </div>
    )
}, () => true)

export default LibraryCard