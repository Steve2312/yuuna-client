import React, {useContext} from 'react';
import {shell} from 'electron';
import PreviewContext from '../context/PreviewContext';
import {formatSeconds} from '../helpers/utils';
import {addToDownloadQueue, isQueued} from '../helpers/downloadBeatmap';
import thumbnail from '../assets/images/no_thumbnail.jpg';

function BeatmapCard(props) {
    const [preview, setPreview] = useContext(PreviewContext);
    const {artist, average_length, title, id, source, unique_id, creator, bpm, user_id} = props.beatmap;

    const cover = {
        backgroundImage: `url("https://assets.ppy.sh/beatmaps/${id}/covers/list@2x.jpg"), url("${thumbnail}")`
    }

    const header = {
        backgroundImage: `url("https://assets.ppy.sh/beatmaps/${id}/covers/card@2x.jpg"), url("${thumbnail}")`
    }

    function install() {
        addToDownloadQueue(props.beatmap);
    }

    function openBeatmapPage() {
        shell.openExternal(`https://osu.ppy.sh/beatmapsets/${id}`);
    }

    function openCreatorPage() {
        shell.openExternal(`https://osu.ppy.sh/users/${user_id}`);
    }

    function previewAudio() {
        props.previewAudio(id);
    }

    const playButtonClass = preview.id === id && preview.playing ? "fas fa-pause" : "fas fa-play";
    const cardClass = preview.id === id ? "card beatmapCardPlaying" : "card";
    const downloadButtonClass = isQueued(id) ? "fas fa-times" : "fas fa-download";

    return (
        <div className="beatmapCard" onDoubleClick={previewAudio}>
            <span className="index">
                {props.index + 1}
            </span>
            <div className={cardClass}>
                <div className="cover" style={cover}>
                <span onClick={previewAudio}><i className={playButtonClass}></i></span>
                </div>
                <div className="metadataWrapper">
                    <div className="header" style={header}/>
                    <div className="metadata">
                        <span className="title">{title}</span>
                        <span className="artist">{artist}</span>
                        <span className="subject">SOURCE: <span className="value">{source ? source : "-"}</span></span>
                        <span className="subject">CREATOR: <span className="value link" onClick={openCreatorPage}>{creator}</span></span>
                    </div>

                    <div className="metadata">
                        <span className="box">DURATION: <span className="value">{formatSeconds(average_length)}</span></span>
                        <span className="box">BPM: <span className="value">{bpm}</span></span>
                        <span className="box">BEATMAP SET ID: <span className="value link" onClick={openBeatmapPage}>{id}</span></span>
                    </div>
                </div>
                <div className="options">
                    <span onClick={install}><i className={downloadButtonClass}></i></span>
                    <span><i className="fas fa-ellipsis-h"></i></span>
                </div>
            </div>
        </div>
    );
}

export default BeatmapCard;