import React, {CSSProperties} from "react";
import styles from '@/styles/searchcard.module.scss';
import { FaPlay, FaPause, FaEllipsisH, FaDownload, FaCircleNotch } from 'react-icons/fa';
import thumbnail from '@/assets/images/no_thumbnail.jpg';
import usePreviewService from "@/hooks/usePreviewService";
import PreviewService from "@/services/PreviewService";
import { shell } from 'electron';

type Props = {
    beatmap: any,
    index: number,
    style?: CSSProperties
}

const SearchCard: React.FC<Props> = ({beatmap, index, style}) => {

    const { artist, average_length, title, id, source, creator, bpm, user_id } = beatmap;

    const [preview] = usePreviewService();

    const play = async () => {
        if (preview.beatmapSetID === id) PreviewService.playPause();
        else await PreviewService.playPreview(id);
    }

    const showBeatmapPage = async () => {
        const beatmapInfoURL = 'https://osu.ppy.sh/beatmapsets/' + id;
        await shell.openExternal(beatmapInfoURL);
    }

    const showCreatorPage = async () => {
        const creatorURL = 'https://osu.ppy.sh/users/' + user_id;
        await shell.openExternal(creatorURL);
    }

    const isPlaying = preview.beatmapSetID === id && preview.playing;
    const isLoading = preview.loading;

    const cover = {
        backgroundImage: `url("https://assets.ppy.sh/beatmaps/${id}/covers/list@2x.jpg"), url("${thumbnail}")`,
    };

    const header = {
        backgroundImage: `url("https://assets.ppy.sh/beatmaps/${id}/covers/card@2x.jpg"), url("${thumbnail}")`,
    };

    return (
        <div className={styles.searchCard} style={style}>
            <span className={styles.index}>{index + 1}</span>
            <div className={styles.content + (preview.beatmapSetID == id ? " " + styles.playing : '')}>
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
                            DURATION: <span className={styles.value}>{average_length}</span>
                        </span>
                        <span className={styles.box}>
                            BPM: <span className={styles.value}>{bpm}</span>
                        </span>
                        <span className={styles.box}>
                            BEATMAP SET ID:{' '}
                            <span className={styles.value + " " + styles.link} onClick={showBeatmapPage}>
                                {id}
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

export default SearchCard;