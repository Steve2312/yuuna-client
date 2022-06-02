import React, {CSSProperties} from "react";
import styles from "@/styles/search-librarycard.module.scss";
import { FaPlay, FaPause, FaEllipsisH, FaDownload, FaCircleNotch } from "react-icons/fa";
import usePreviewService from "@/hooks/usePreviewService";
import PreviewService from "@/services/PreviewService";
import getBackgroundImageStyle from "@/utils/BackgroundImageStyle";
import formatSeconds from "@/utils/FormatSeconds";
import {openBeatmapPage, openCreatorPage} from "@/utils/Pages";
import Beatmap from "@/types/Beatmap";
import DownloadService from "@/services/DownloadService";

type Props = {
    beatmap: Beatmap,
    index: number,
    style?: CSSProperties
}

const SearchCard: React.FC<Props> = React.memo<Props>(({beatmap, index, style}) => {

    const [preview] = usePreviewService();

    const isPlaying = preview.beatmapSetID == beatmap.id && preview.playing;
    const isLoading = preview.loading;

    const cover = getBackgroundImageStyle(`https://assets.ppy.sh/beatmaps/${beatmap.id}/covers/list@2x.jpg`);
    const header = getBackgroundImageStyle(`https://assets.ppy.sh/beatmaps/${beatmap.id}/covers/card@2x.jpg`);

    const play = async () => {
        if (preview.beatmapSetID === beatmap.id) PreviewService.playPause();
        else await PreviewService.playPreview(beatmap.id);
    };

    return (
        <div className={styles.searchCard} style={style}>
            <span className={styles.index}>{index + 1}</span>
            <div className={styles.content + (preview.beatmapSetID == beatmap.id ? " " + styles.playing : "")}>
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
                            SOURCE: <span className={styles.value}>{beatmap.source ? beatmap.source : "-"}</span>
                        </span>
                        <span className={styles.subject}>
                            CREATOR:{" "}
                            <span className={styles.value + " " + styles.link} onClick={() => openCreatorPage(beatmap.creator)}>
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
                            BEATMAP SET ID:{" "}
                            <span className={styles.value + " " + styles.link} onClick={() => openBeatmapPage(beatmap.id)}>
                                {beatmap.id}
                            </span>
                        </span>
                    </div>
                </div>
                <div className={styles.options}>
                    <FaDownload onClick={() => DownloadService.download(beatmap)}/>
                    <FaEllipsisH />
                </div>
            </div>
        </div>
    );
}, () => true);

export default SearchCard;