import React from "react";
import Download from "@/types/Download";
import styles from "@/styles/downloadcard.module.scss";
import getBackgroundImageStyle from "@/utils/BackgroundImageStyle";

type Props = {
    download: Download,
    style: React.CSSProperties
}

const DownloadCard: React.FC<Props> = ({download, style}) => {

    const cover = getBackgroundImageStyle(`https://assets.ppy.sh/beatmaps/${download.beatmap.id}/covers/list@2x.jpg`);

    const percentage = download.percentage?.toFixed(2) + "%";
    const status = download.status + (download.percentage && download.status == "Downloading" ? " : " + percentage : "");

    return (
        <div className={styles.downloadCard} style={style}>
            <div className={styles.cover} style={cover}/>
            <div className={styles.content}>
                <span className={styles.artist}>{download.beatmap.artist}</span>
                <span className={styles.title}>{download.beatmap.title}</span>
                <span className={styles.status}>{status}</span>
            </div>

        </div>
    );
};

export default DownloadCard;