import React, { useEffect, useState } from 'react';
import thumbnail from '../assets/images/no_thumbnail.jpg';
import DownloadHandler from '../helpers/DownloadHandler';

function DownloadQueueCard(props) {
    const {id, title, artist} = props.beatmap;
    const [downloadData, setDownloadData] = useState(DownloadHandler.getDownloadData());

    const cover = {
        backgroundImage: `url("https://assets.ppy.sh/beatmaps/${id}/covers/list@2x.jpg"), url("${thumbnail}")`
    }

    function getDownloadInfo() {
        if (downloadData.progress.id === id) {
            if (downloadData.progress.importing) {
                return "Importing...";
            }
            var speed = (downloadData.progress.speed / 1000000).toFixed(2);
            var percent = (downloadData.progress.percent * 100).toFixed(2);
            return percent + '% - ' + speed + ' MB/s';
        }

        return "In queue";
    }

    useEffect(() => {
        DownloadHandler.addObserver(setDownloadData);
        return () => DownloadHandler.removeObserver(setDownloadData);
    }, []);

    return (
        <div className="downloadQueueCard">
            <div className="cover" style={cover}>
                <span><i className="fas fa-times"></i></span>
            </div>
            <div className="info">
                <span className="artist">{artist}</span>
                <span className="title">{title}</span>
                <span className="downloadInfo">{getDownloadInfo()}</span>
            </div>
        </div>
    );
}

export default DownloadQueueCard;