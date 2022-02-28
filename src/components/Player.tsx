import React, { ChangeEvent, useEffect, useState } from 'react';
import { formatSeconds } from '../helpers/utils';
import { shell } from 'electron';
import path from 'path';
import thumbnail from '../assets/images/no_thumbnail.jpg';
import '../styles/Player.css';
import { songsPath } from '../helpers/paths';
import { pathExists } from '../helpers/fileSystem';
import PlayerService from '../services/PlayerService';
import usePlayerService from '../hooks/usePlayerService';

const PlayerBar: React.FC = () => {

    const [player] = usePlayerService();
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [drag, setDrag] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(player.audio.volume);

    useEffect(() => {
        const handleTimeUpdate =() => {
            if (!drag) {
                setCurrentTime(PlayerService.seek());
            }
        }

        player.audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            player.audio.removeEventListener('timeupdate', handleTimeUpdate);
        }
    }, [player, drag]);

    const getAlbumCoverStyle = (): React.CSSProperties => {
        
        if (player.id) {
            const id = player.id.toString();
            const coverPath = path.join(songsPath, id, 'cover.jpg');
            if (pathExists(coverPath)) {
                return {
                    backgroundImage: `url("${coverPath.replace(/\\/g, "/")}")`
                }
            }
        }

        return {
            backgroundImage: `url("${thumbnail}")`
        }
    }

    const openBeatmapPage = (): void => {
        const url = `https://osu.ppy.sh/beatmapsets/${player.beatmapSetID}`
        shell.openExternal(url);
    }

    const duration = (): number => {
        const duration = player.audio.duration;

        if (duration) {
            return Math.round(duration);
        }

        return 0;
    }

    const handleDrag = (event: ChangeEvent) => {
        const element = event.target as HTMLInputElement;
        setCurrentTime(element.valueAsNumber)
    }

    const seek = () => {
        setDrag(false);
        PlayerService.seek(currentTime);
    }

    const playbackRate = () => {
        const rate = player.audio.playbackRate;
        if (rate == 1.0) {
            player.audio.playbackRate = 1.5;
        } else {
            player.audio.playbackRate = 1.0;
        }
    }

    const getVolumeIconClass = () => {
        if (volume == 0) {
            return 'fas fa-volume-mute';
        }

        if (volume < 0.45) {
            return 'fas fa-volume-down';
        }

        if (volume >= 0.45) {
            return 'fas fa-volume-up';
        }
    }

    const handleVolume = (event: ChangeEvent) => {
        const element = event.target as HTMLInputElement;
        const volume = element.valueAsNumber;
        setVolume(volume);
        PlayerService.volume(volume);
    }

    const playButtonClass = player.playing ? 'fas fa-pause' : 'fas fa-play';
    const shuffleButtonClass = player.shuffled ? 'option active' : 'option';

    return (
        <>
            <div className="playerData">
                <div className="cover" style={getAlbumCoverStyle()}></div>
                <div>
                    <span className="artist">{player.artist != null ? player.artist : '-'}</span>
                    <span className="title">{player.title != null ? player.title : '-'}</span>
                    <span className="beatmapsetid">
                        BEATMAPSET ID: <span onClick={openBeatmapPage}>{player.beatmapSetID}</span>
                    </span>
                </div>
            </div>

            <div className="playerControl">
                <div className="buttons">
                    <span className={shuffleButtonClass} onClick={PlayerService.shuffle}>
                        <i className="fas fa-random"></i>
                    </span>
                    <span onClick={PlayerService.backward}>
                        <i className="fas fa-step-backward"></i>
                    </span>
                    <span onClick={PlayerService.playPause}>
                        <i className={playButtonClass}></i>
                    </span>
                    <span onClick={PlayerService.forward}>
                        <i className="fas fa-step-forward"></i>
                    </span>
                    <span className="option">
                        <i className="fas fa-redo-alt"></i>
                    </span>
                </div>
                <div className="slider">
                    <input type="range" min="0" max={duration()} value={Math.round(currentTime)} onChange={handleDrag} onMouseDown={() => setDrag(true)} onMouseUp={seek} />
                </div>
                <div className="range">
                    <span>{formatSeconds(currentTime)}</span>
                    <span>{formatSeconds(player.audio.duration)}</span>
                </div>
            </div>

            <div className="playerOptions">
                <span onClick={() => playbackRate()}>x1.0</span>
                <span className="volumeIcon" onClick={PlayerService.mute}>
                    <i className={getVolumeIconClass()}></i>
                </span>
                <div className="volume">
                    <input type="range" min="0" step="0.01" max="0.52" value={PlayerService.volume()} onChange={handleVolume} />
                </div>
                <span className="icon">
                    <i className="fas fa-poll-h"></i>
                </span>
            </div>
        </>
    );
}

export default PlayerBar;
