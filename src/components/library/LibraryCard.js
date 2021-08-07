import React, {useState, useEffect} from 'react';
import path from 'path';
import {shell} from 'electron';
import {formatSeconds} from '../../helpers/utils';
import thumbnail from '../../assets/images/no_thumbnail.jpg';
import PlayerHandler from '../../helpers/PlayerHandler';
import {songsPath} from '../../helpers/paths';
import ContextMenuHandler from '../../helpers/ContextMenuHandler';

function LibraryCard(props) {
    const [player, setPlayer] = useState(PlayerHandler.getPlayer());
    const {artist, duration, title, id, source, beatmapset_id, creator, bpm} = props.beatmap;

    const cover = {
        backgroundImage: `url("${path.join(songsPath, id, "cover.jpg").toString().replaceAll("\\", "/")}"), url("${thumbnail}")`
    }
    const header = {
        backgroundImage: `url("${path.join(songsPath, id, "header.jpg").toString().replaceAll("\\", "/")}"), url("${thumbnail}")`
    }

    function openBeatmapPage() {
        shell.openExternal(`https://osu.ppy.sh/beatmapsets/${beatmapset_id}`);
    }

    function openCreatorPage() {
        shell.openExternal(`https://osu.ppy.sh/users/${creator}`);
    }

    function playAudio() {
        PlayerHandler.loadFromPlaylist("library", props.playlist, props.index);
    }

    function createContext() {
        return [
            {
                name: player.id == id && player.playing ? "Pause" : "Play",
                function: playAudio
            },
            {
                name: "View beatmap listing on osu!",
                function: openBeatmapPage
            },
            {
                name: "View on " + creator + " on osu!",
                function: openCreatorPage
            },
            {
                name: "Add to playlist",
                buttons: [{
                    name: "Playlist 1",
                    function: () => console.log("1")
                },
                {
                    name: "Playlist 2",
                    function: () => console.log("2")
                },
                {
                    name: "Playlist 3",
                    function: () => console.log("3")
                }]
            },
            {
                name: "Delete Song",
                function: () => console.log("Delete folder with id: " + id)
            }
        ];
        
    }

    // Get updates from PlayerHandler by passing setPlayer;
    useEffect(() => {
        PlayerHandler.addObserver(setPlayer);
        return () => PlayerHandler.removeObserver(setPlayer);
    }, []);

    const playButtonClass = player.id == id && player.playing ? "fas fa-pause" : "fas fa-play";
    const cardClass = player.id == id ? "card beatmapCardPlaying" : "card";

    return (
        <div className="beatmapCard" style={props.style} onContextMenu={(event) => ContextMenuHandler.showContext(event, createContext())}>
            <span className="index">
                {props.index + 1}
            </span>
            <div className={cardClass}>
                <div className="cover" style={cover}>
                <span onClick={playAudio}><i className={playButtonClass}></i></span>
                </div>
                <div className="metadataWrapper" onDoubleClick={playAudio}>
                    <div className="header" style={header}/>
                    <div className="metadata">
                        <span className="title">{title}</span>
                        <span className="artist">{artist}</span>
                        <span className="subject">SOURCE: <span className="value">{source ? source : "-"}</span></span>
                        <span className="subject">CREATOR: <span className="value link" onClick={openCreatorPage}>{creator}</span></span>
                    </div>

                    <div className="metadata">
                        <span className="box">DURATION: <span className="value">{formatSeconds(duration)}</span></span>
                        <span className="box">BPM: <span className="value">{bpm}</span></span>
                        <span className="box">BEATMAP SET ID: <span className="value link" onClick={openBeatmapPage}>{beatmapset_id}</span></span>
                    </div>
                </div>
                <div className="options">
                    <span onClick={(event) => ContextMenuHandler.showContext(event, createContext())}><i className="fas fa-ellipsis-h"></i></span>
                </div>
            </div>
        </div>
    );
}

export default LibraryCard;