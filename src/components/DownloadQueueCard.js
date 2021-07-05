import React, { useContext } from 'react';
import thumbnail from '../assets/images/no_thumbnail.jpg';
import DownloadProgressContext from '../context/DownloadProgressContext';

function DownloadQueueCard(props) {
    const {id, title, artist} = props.beatmap;
    const [downloadProgress, setDownloadProgress] = useContext(DownloadProgressContext);
    const cover = {
        backgroundImage: `url("https://b.ppy.sh/thumb/${id}l.jpg"), url("${thumbnail}")`
    }

    function getDownloadInfo() {
        if (downloadProgress && downloadProgress.id === id) {
            if (downloadProgress.importing) {
                return "Importing...";
            }
            var speed = (downloadProgress.speed / 1000000).toFixed(2);
            var percent = (downloadProgress.percent * 100).toFixed(2);
            return percent + '% - ' + speed + ' MB/s';
        }

        return "In queue";
    }
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