import React, {CSSProperties, useEffect, useState} from "react";
import styles from '@/styles/search-librarycard.module.scss';
import { FaPlay, FaPause, FaEllipsisH } from 'react-icons/fa';
import Song from "@/types/Song";
import {getCoverPath, getHeaderPath} from "@/utils/Paths";
import getBackgroundImageStyle from "@/utils/BackgroundImageStyle";
import PlayerService from "@/services/PlayerService";
import LibraryService from "@/services/LibraryService";
import usePlayerService from "@/hooks/usePlayerService";
import formatSeconds from "@/utils/FormatSeconds";
import {openBeatmapPage, openCreatorPage} from "@/utils/Pages";

type Props = {
    song: Song,
    style?: CSSProperties
}

const LibraryCard: React.FC<Props> = React.memo(({song, style}) => {

    const [player] = usePlayerService();

    const coverPath = getCoverPath(song);
    const headerPath = getHeaderPath(song);

    const isPlaying = player.current?.id == song.id && player.playing;

    const play = async () => {
        await PlayerService.playFromPlaylist("", LibraryService.getState().songs, song.index);
    }

    return (
        <div className={styles.searchCard} style={style}>
            <span className={styles.index}>{song.index + 1}</span>
            <div className={styles.content + (player.current?.id == song.id ? " " + styles.playing : '')}>
                <div className={styles.albumCover} style={getBackgroundImageStyle(coverPath)}>
                    {
                        isPlaying ?
                            <FaPause onClick={play}/>
                            :
                            <FaPlay onClick={play}/>
                    }
                </div>
                <div className={styles.container}>
                    <div className={styles.cardCover} style={getBackgroundImageStyle(headerPath)} />
                    <div className={styles.section}>
                        <span className={styles.title}>{song.title}</span>
                        <span className={styles.artist}>{song.artist}</span>
                        <span className={styles.subject}>
                            SOURCE: <span className={styles.value}>{song.source ? song.source : '-'}</span>
                        </span>
                        <span className={styles.subject}>
                            CREATOR:{' '}
                            <span className={styles.value + " " + styles.link} onClick={() => openCreatorPage(song.creator)}>
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
                            <span className={styles.value + " " + styles.link} onClick={() => openBeatmapPage(song.beatmapset_id)}>
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
    );
}, () => true);

export default LibraryCard;