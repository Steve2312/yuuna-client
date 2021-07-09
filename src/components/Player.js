import React, { useContext, useEffect, useState } from 'react';
import {formatSeconds} from '../helpers/utils';
import Electron from 'electron';
import path from 'path';
import thumbnail from '../assets/images/no_thumbnail.jpg';
import PlayerHandler from '../helpers/PlayerHandler';

const appData = Electron.remote.app.getAppPath();
const songsPath = path.join(appData, "songs");

function Player() {
    const [player, setPlayer] = useState(PlayerHandler.getPlayer());

    const [currentTime, setCurrentTime] = useState(0);
    const [drag, setDrag] = useState(false);

    const cover = {
        backgroundImage: `url("${path.join(songsPath, player.id ? player.id : "", "cover.jpg").toString().replaceAll("\\", "/")}"), url("${thumbnail}")`
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

    useEffect(() => {
        const interval = setInterval(() => {
            if(!drag) {
                setCurrentTime(PlayerHandler.seek());
            }
        }, 500);
        return () => clearInterval(interval);
    }, [drag]);

    useEffect(() => {
        PlayerHandler.addObserver(setPlayer);
        return () => PlayerHandler.removeObserver(setPlayer);
    }, []);

    // ClassNames that need to be changed
    const playButtonClass = player.playing ? "fas fa-pause" : "fas fa-play";
    const shuffleButtonClass = player.shuffle ? "options active" : "options";

    return (<>
        <div className="playerControlsWrapper">
            <div className="playerControls">
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
                <span className="options">
                    <i className="fas fa-redo-alt"></i>
                </span>
            </div>
            <div className="playerVolume">
                <input type="range" min="0" step="0.01" max="0.52" defaultValue={PlayerHandler.volume()} onChange={(event) => PlayerHandler.volume(event.target.value)} />
            </div>
        </div>
        <div className="playerDataWrapper">
            <div className="cover" style={cover}></div>

            <div className="playerMetaDataWrapper">

                <div className="playerMetaData">
                    <span className="artist">{player.artist}</span>
                    <span className="title">{player.title}</span>
                </div>

                <div className="playerTimeControl">
                    <div className="time">{formatSeconds(currentTime)}</div>
                    <div className="playerSlider">
                        <input type="range" min="0" max={getDuration()} value={Math.round(currentTime)} onChange={handleDrag} onMouseDown={() => setDrag(true)} onMouseUp={seek}/>
                    </div>
                    <div className="time">{formatSeconds(player.audio.duration)}</div>
                </div>
            </div>
        </div>
    </>);
}

export default Player;