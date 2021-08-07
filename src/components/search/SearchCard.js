import React, {useState, useContext, useEffect} from 'react';
import {shell} from 'electron';
import {formatSeconds} from '../../helpers/utils';
import {addToDownloadQueue, inQueue} from '../../helpers/DownloadHandler';
import thumbnail from '../../assets/images/no_thumbnail.jpg';
import LibraryHandler from '../../helpers/LibraryHandler';
import DownloadHandler from '../../helpers/DownloadHandler';
import PreviewHandler from '../../helpers/PreviewHandler';
import ContextMenuHandler from '../../helpers/ContextMenuHandler';

function BeatmapCard(props) {
    const [preview, setPreview] = useState(PreviewHandler.getPreview());

    const [library, setLibrary] = useState(LibraryHandler.getLibrary());
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
        for (let x = 0; x < library.all.length; x++) {
            const song = library.all[x];
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
        LibraryHandler.addObserver(setLibrary);
        return () => {
            PreviewHandler.removeObserver(setPreview);
            DownloadHandler.removeObserver(setDownloadData);
            LibraryHandler.removeObserver(setLibrary);
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

    function createContext() {
        return [
            {
                name: preview.id === id && preview.playing ? "Pause preview" : "Play preview",
                function: () => PreviewHandler.playPreview(id)
            },
            {
                name: inQueue(id) ? "Cancel download" : "Download",
                function: install
            },
            {
                name: "View beatmap listing on osu!",
                function: openBeatmapPage
            },
            {
                name: "View on " + creator + " on osu!",
                function: openCreatorPage
            }
        ];
        
    }

    return (
        <div style={props.style} className="beatmapCard" onContextMenu={(event) => ContextMenuHandler.showContext(event, createContext())}>
            <span className="index">
                {props.index + 1}
            </span>
            <div className={cardClass}>
                <div className="cover" style={cover}>
                <span onClick={() => PreviewHandler.playPreview(id)}><i className={playButtonClass}></i></span>
                </div>
                <div className="metadataWrapper" onDoubleClick={() => PreviewHandler.playPreview(id)}>
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
                    <span onClick={(event) => ContextMenuHandler.showContext(event, createContext())}><i className="fas fa-ellipsis-h"></i></span>
                </div>
            </div>
        </div>
    );
}

export default BeatmapCard;