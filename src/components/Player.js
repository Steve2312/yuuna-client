import React, { useContext, useEffect, useState } from 'react';
import PlayerContext from '../context/PlayerContext';
import PreviewContext from '../context/PreviewContext';
import {formatSeconds} from '../utils/utils'

function Player() {
    const [player, setPlayer] = useContext(PlayerContext);
    const [preview, setPreview] = useContext(PreviewContext);
    const [currentTime, setCurrentTime] = useState(0);

    const [drag, setDrag] = useState(false);

    /**
     * Test variables
     */
    const id = 1711472;
    const beatmapset = 753086;
    const playlist = "library";
    const title = "GALAXY HidE and SeeK";
    const artist = "AZALEA";
    const song = "C:/Users/stefl/AppData/Roaming/YuunaBeta/songs/753086/1711472/galaxy.mp3";

    const cover = {
        backgroundImage: `url("C:/Users/stefl/AppData/Roaming/YuunaBeta/songs/753086/1711472/cover.jpg")`
    }

    /**
     * Audio settings
     */
    player.audio.volume = player.volume;

    /*
     *When the user releases the mouseButton from the slider
     *The song will be seeked to the time he released the mouse.
    */
    function seek() {
        setDrag(false);
        player.audio.currentTime = currentTime;
    }

    function setVolume(volume) {
        setPlayer(data => ({...data, volume}))
    }

    function getDuration() {
        const duration = player.audio.duration;
        if (duration) {
            return Math.round(duration);
        }
        return 0;
    }

    /**
     * This function loads an audio file into the Audio object
     * And updates the data so every other component knows what is playing.
     * @param {*} src - File path to the audio file.
     */
    function load(src) {
        // If the same song gets loaded toggle play and pause.
        if (id === player.id) {
            togglePlayPause();
        } else {
            player.audio.src = src;
            setPlayer(data => ({
                ...data,
                beatmapset: beatmapset,
                id: id,
                playlist: playlist,
                artist: artist,
                title: title,
            }));
        }
    }

    /**
     * Test
     */
    function testLoad() {
        load(song);
        play();
    }

    /**
     * Resumes the track
     * Pauses the preview audio if playing
     */
    function play() {
        pausePreviewAudio();
        player.audio.play();
    }

    function pause() {
        player.audio.pause();
    }

    /**
     * Toggles between play and pause if a song is loaded
     */
    function togglePlayPause() {
        if (player.audio.src) {
            player.audio.paused ? play() : pause();
        }
    }

    /**
     * Pauses the preview audio if playing
     */
    function pausePreviewAudio() {
        if (!preview.audio.paused) {
            preview.audio.pause();
        }
    }

    function handleDrag(event) {
        setCurrentTime(event.target.value);
    }

    /**
     * When audio gets paused from unknown resource
     */
    function updatePlayingState() {
        setPlayer(data => ({...data, playing: !player.audio.paused}));
    }

    player.audio.onpause = () => {
        updatePlayingState();
    };

    player.audio.onplay = () => {
        updatePlayingState();
    };

    player.audio.onended = () => {
        // next song
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if(!drag) {
                setCurrentTime(player.audio.currentTime);
            }
        }, 500);
        return () => clearInterval(interval);
      }, [drag]);

    // ClassNames that need to be changed
    const playButtonClass = player.playing ? "fas fa-pause" : "fas fa-play";

    return (<>
        <div className="playerControlsWrapper">
            <div className="playerControls">
                <span className="options" onClick={testLoad}>
                    <i className="fas fa-random"></i>
                </span>
                <span>
                    <i className="fas fa-step-backward"></i>
                </span>
                <span onClick={togglePlayPause}>
                    <i className={playButtonClass}></i>
                </span>
                <span>
                    <i className="fas fa-step-forward"></i>
                </span>
                <span className="options">
                    <i className="fas fa-redo-alt"></i>
                </span>
            </div>
            <div className="playerVolume">
                <input type="range" min="0" step="0.01" max="0.21" defaultValue={player.volume} onChange={(event) => setVolume(event.target.value)} />
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