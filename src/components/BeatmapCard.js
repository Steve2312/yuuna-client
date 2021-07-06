import React, {useState, useContext, useEffect} from 'react';
import {shell} from 'electron';
import {formatSeconds} from '../helpers/utils';
import {addToDownloadQueue, inQueue} from '../helpers/DownloadHandler';
import thumbnail from '../assets/images/no_thumbnail.jpg';
import LibraryContext from '../context/LibraryContext';
import DownloadHandler from '../helpers/DownloadHandler';
import PreviewHandler from '../helpers/PreviewHandler';

function BeatmapCard(props) {
    const [preview, setPreview] = useState(PreviewHandler.getPreview());

    const [library, setLibrary] = useContext(LibraryContext);
    const [downloadData, setDownloadData] = useState(DownloadHandler.getDownloadData());

    const {artist, average_length, title, id, source, creator, bpm, user_id} = props.beatmap;

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

    function inLibrary() {
        for (let x = 0; x < library.length; x++) {
            const song = library[x];
            if (song.beatmapset_id === id.toString()) {
                return true;
            }
        }
        return false;
    }

    function openCreatorPage() {
        shell.openExternal(`https://osu.ppy.sh/users/${user_id}`);
    }

    useEffect(() => {
        PreviewHandler.addObserver(setPreview);
        DownloadHandler.addObserver(setDownloadData);
        return () => {
            PreviewHandler.removeObserver(setPreview);
            DownloadHandler.removeObserver(setDownloadData);
        }
    }, []);

    const playButtonClass = preview.id === id && preview.playing ? "fas fa-pause" : "fas fa-play";
    const cardClass = preview.id === id ? "card beatmapCardPlaying" : "card";

    function downloadButton () {
        if (inLibrary()) {
            return null;
        }

        if (downloadData.progress.id == id && downloadData.progress.importing) {
            return <span><i className="fas fa-spinner loading"></i></span>;
        }

        const downloadButtonClass = inQueue(id) ? "fas fa-times" : "fas fa-download";
        if (!inLibrary()) {
            return <span onClick={install}><i className={downloadButtonClass}></i></span>;
        }
    }

    return (
        <div className="beatmapCard" onDoubleClick={() => PreviewHandler.playPreview(id)}>
            <span className="index">
                {props.index + 1}
            </span>
            <div className={cardClass}>
                <div className="cover" style={cover}>
                <span onClick={() => PreviewHandler.playPreview(id)}><i className={playButtonClass}></i></span>
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
                    {downloadButton()}
                    <span><i className="fas fa-ellipsis-h"></i></span>
                </div>
            </div>
        </div>
    );
}

export default BeatmapCard;