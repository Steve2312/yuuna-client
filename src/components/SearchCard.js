import React, {useContext} from 'react';
import {shell} from 'electron';
import {formatSeconds} from '../helpers/utils';
import PreviewContext from '../context/PreviewContext';
import {addToDownloadQueue, isQueued} from '../helpers/downloadBeatmap';
import thumbnail from '../assets/images/no_thumbnail.jpg'

function SearchCard(props) {
    const [preview, setPreview] = useContext(PreviewContext);
    const {artist, average_length, title, id, source, unique_id} = props.beatmap;
    const cover = {
        backgroundImage: `url("https://b.ppy.sh/thumb/${id}l.jpg"), url("${thumbnail}")`
    }
    
    function install() {
        addToDownloadQueue(id, unique_id, title, artist);
    }

    function openURL() {
        shell.openExternal(`https://osu.ppy.sh/beatmapsets/${id}`);
    }

    function previewAudio() {
        props.previewAudio(id);
    }

    const playButtonClass = preview.id === id && preview.playing ? "fas fa-pause" : "fas fa-play";
    const searchCardClass = preview.id === id ? "searchCard searchCardPlaying" : "searchCard";
    const downloadButtonClass = isQueued(id) ? "fas fa-times" : "fas fa-download";

    return (
        <div className={searchCardClass} onDoubleClick={previewAudio}>
            <div className="cover" style={cover}>
                <p className="playButton">
                    <span onClick={previewAudio}>
                        <i className={playButtonClass}></i>
                    </span>
                </p>
            </div>

            <div className="metadataWrapper">

                <div className="metadata">
                    <div>
                        <p className="title">TITLE</p>
                        <p className="value">{title}</p>
                    </div>
                </div>

                <div className="metadata">
                    <div>
                        <p className="title">ARTIST</p>
                        <p className="value">{artist}</p>
                    </div>
                </div>

                <div className="metadata">
                    <div>
                        <p className="title">DURATION</p>
                        <p className="value">{formatSeconds(average_length)}</p>
                    </div>
                </div>

                <div className="metadata">
                    <div>
                        <p className="title">SOURCE</p>
                        <p className="value">{source ? source : "-"}</p>
                    </div>
                </div>

                <div className="metadata">
                    <div>
                        <p className="title">BEATMAP ID</p>
                        <p className="value beatmapValue" onClick={openURL}>{id}</p>
                    </div>
                </div>
            </div>

            <div className="options">
                <span onClick={install}><i className={downloadButtonClass}></i></span>
                <span><i className="fas fa-ellipsis-h"></i></span>
            </div>
        </div>
    );
}

export default SearchCard;