import React, { useEffect, useState } from 'react';
import {formatSeconds} from '../helpers/utils';
import Electron, {shell} from 'electron';
import path from 'path';
import thumbnail from '../assets/images/no_thumbnail.jpg';
import PlayerHandler from '../helpers/PlayerHandler';
import './PlayerBar.css';

const appData = Electron.remote.app.getAppPath();
const songsPath = path.join(appData, "songs");

function PlayerBar() {
    const [player, setPlayer] = useState(PlayerHandler.getPlayer());
    const [currentTime, setCurrentTime] = useState(0);
    const [drag, setDrag] = useState(false);

    const forceUpdate = useState(0)[1];

    const cover = {
        backgroundImage: `url("${path.join(songsPath, player.id ? player.id : "", "cover.jpg").toString().replaceAll("\\", "/")}"), url("${thumbnail}")`
    }

    function openBeatmapPage() {
        shell.openExternal(`https://osu.ppy.sh/beatmapsets/${player.beatmapset}`);
    }

    function getDuration() {
        const duration = player.audio.duration;
        if (duration) {
            return Math.round(duration);
        }
        return 0;
    }

    function handleDrag(event) {
        setCurrentTime(event.target.value);
    }

    function seek() {
        setDrag(false);
        PlayerHandler.seek(currentTime);
    }

    function handleVolume(event) {
        const volume = event.target.value;
        forceUpdate(volume);
        PlayerHandler.volume(volume);
    }

    function playbackRate(rate) {
        player.audio.playbackRate = rate;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if(!drag) {
                setCurrentTime(PlayerHandler.seek());
            }
        }, 200);
        return () => clearInterval(interval);
    }, [drag]);

    useEffect(() => {
        PlayerHandler.addObserver(setPlayer);
        return () => PlayerHandler.removeObserver(setPlayer);
    }, []);

    // ClassNames that need to be changed
    const playButtonClass = player.playing ? "fas fa-pause" : "fas fa-play";
    const shuffleButtonClass = player.shuffle ? "option active" : "option";

    function getVolumeIconClass() {
        const volume = PlayerHandler.volume();
        if (volume == 0) {
            return "fas fa-volume-mute";
        }

        if (volume < 0.45) {
            return "fas fa-volume-down";
        }

        if (volume >= 0.45) {
            return "fas fa-volume-up";
        }
    }

    return <>
        <div className="playerData">
            <div className="cover" style={cover}></div>
            <div>
                <span className="artist">{player.artist}</span>
                <span className="title">{player.title}</span>
                <span className="beatmapsetid">BEATMAPSET ID: <span onClick={openBeatmapPage}>{player.beatmapset}</span></span>
            </div>
        </div>

        <div className="playerControl">
            <div className="buttons">
                <span className={shuffleButtonClass} onClick={PlayerHandler.toggleShuffle}>
                    <i className="fas fa-random"></i>
                </span>
                <span onClick={PlayerHandler.reverse}>
                    <i className="fas fa-step-backward"></i>
                </span>
                <span onClick={PlayerHandler.togglePlayPause}>
                    <i className={playButtonClass}></i>
                </span>
                <span onClick={PlayerHandler.forward}>
                    <i className="fas fa-step-forward"></i>
                </span>
                <span className="option">
                    <i className="fas fa-redo-alt"></i>
                </span>
            </div>
            <div className="slider">
                <input type="range" min="0" max={getDuration()} value={Math.round(currentTime)} onChange={handleDrag} onMouseDown={() => setDrag(true)} onMouseUp={seek}/>
            </div>
            <div className="range">
                <span>{formatSeconds(currentTime)}</span>
                <span>{formatSeconds(player.audio.duration)}</span>
            </div>
        </div>

        <div className="playerOptions">
            <span onClick={() => playbackRate(1.5)}>x1.0</span>
            <span className="volumeIcon" onClick={PlayerHandler.toggleMute}>
                <i className={getVolumeIconClass()}></i>
            </span>
            <div className="volume">
                <input type="range" min="0" step="0.01" max="0.52" value={PlayerHandler.volume()} onChange={handleVolume} />
            </div>
            <span className="icon"><i class="fas fa-poll-h"></i></span>
        </div>
    </>;
}

export default PlayerBar;