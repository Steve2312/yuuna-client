import React, {CSSProperties, useEffect, useState} from "react";
import styles from '@/styles/search-librarycard.module.scss';
import { FaPlay, FaPause, FaEllipsisH, FaDownload } from 'react-icons/fa';
import thumbnail from '@/assets/images/no_thumbnail.jpg';
import Song from "@/interfaces/Song";
import {getCoverPath, getHeaderPath} from "@/utils/Paths";
import {shell} from "electron";

type Props = {
    song: Song,
    style?: CSSProperties
}

const LibraryCard: React.FC<Props> = ({song, style}) => {

    const { title, artist, creator, source, id, beatmapset_id, duration, bpm, index } = song;

    const [coverPath, setCoverPath] = useState<string | null>(null);
    const [headerPath, setHeaderPath] = useState<string | null>(null);

    useEffect(() => {
        getCoverPath(song).then(setCoverPath)
        getHeaderPath(song).then(setHeaderPath)
    }, [])

    const showBeatmapPage = async () => {
        const beatmapInfoURL = 'https://osu.ppy.sh/beatmapsets/' + id;
        await shell.openExternal(beatmapInfoURL);
    }

    const showCreatorPage = async () => {
        const creatorURL = 'https://osu.ppy.sh/users/' + creator;
        await shell.openExternal(creatorURL);
    }

    const isPlaying = false;

    const getBackgroundImageStyle = (path: string | null) => {
        if (path == null) {
            return {
                backgroundImage: `url("${thumbnail}")`
            }
        } else {
            const imagePath = path.replaceAll('\\', '/');
            return {
                backgroundImage: `url("file://${imagePath}"), url("${thumbnail}")`
            }
        }
    }

    return (
        <div className={styles.searchCard} style={style}>
            <span className={styles.index}>{index + 1}</span>
            <div className={styles.content}>
                <div className={styles.albumCover} style={getBackgroundImageStyle(coverPath)}>
                    {
                        isPlaying ?
                            <FaPause />
                            :
                            <FaPlay />
                    }
                </div>
                <div className={styles.container}>
                    <div className={styles.cardCover} style={getBackgroundImageStyle(headerPath)} />
                    <div className={styles.section}>
                        <span className={styles.title}>{title}</span>
                        <span className={styles.artist}>{artist}</span>
                        <span className={styles.subject}>
                            SOURCE: <span className={styles.value}>{source ? source : '-'}</span>
                        </span>
                        <span className={styles.subject}>
                            CREATOR:{' '}
                            <span className={styles.value + " " + styles.link} onClick={showCreatorPage}>
                                {creator}
                            </span>
                        </span>
                    </div>

                    <div className={styles.section}>
                        <span className={styles.box}>
                            DURATION: <span className={styles.value}>{duration}</span>
                        </span>
                        <span className={styles.box}>
                            BPM: <span className={styles.value}>{bpm}</span>
                        </span>
                        <span className={styles.box}>
                            BEATMAP SET ID:{' '}
                            <span className={styles.value + " " + styles.link} onClick={showBeatmapPage}>
                                {beatmapset_id}
                            </span>
                        </span>
                    </div>
                </div>
                <div className={styles.options}>
                    <FaDownload />
                    <FaEllipsisH />
                </div>
            </div>
        </div>
    );
}

export default LibraryCard;