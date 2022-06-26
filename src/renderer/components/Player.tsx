import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from '@/styles/player.module.scss';
import { getCoverPath } from '@/utils/Paths';
import PlayerService from '../services/PlayerService';
import PreviewService from '../services/PreviewService';
import usePlayerService from '@/hooks/usePlayerService';
import getBackgroundImageStyle from '@/utils/BackgroundImageStyle';
import {
    FaPollH,
    FaVolumeDown,
    FaVolumeUp,
    FaVolumeMute,
    FaRandom,
    FaBackward,
    FaPause,
    FaPlay,
    FaForward,
    FaRedoAlt,
    FaVolumeOff
} from 'react-icons/fa';
import formatSeconds from '@/utils/FormatSeconds';
import { openBeatmapPage } from '@/utils/Pages';
import useLibraryService from "@/hooks/useLibraryService";

const PlayerBar: React.FC = () => {
    const [library] = useLibraryService();
    const [player] = usePlayerService();
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [drag, setDrag] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(player.audio.volume);
    const coverPath = player.current ? getCoverPath(player.current) : null;

    useEffect(() => {
        const handleTimeUpdate = (): void => {
            if (!drag) {
                setCurrentTime(PlayerService.seek());
            }
        };

        player.audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            player.audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [player, drag]);

    useEffect(() => {
        if (!player.current && library.songs.length > 0) {
            PlayerService.playFromPlaylist('Library', library.songs, 0).then(async () => {
                await PlayerService.pause();
            });
        }
    }, [library]);

    const duration = player.audio.duration && !isNaN(player.audio.duration) ? Math.round(player.audio.duration) : 0;

    const handleDrag = (event: ChangeEvent): void => {
        const element = event.target as HTMLInputElement;
        setCurrentTime(element.valueAsNumber);
    };

    const seek = (): void => {
        setDrag(false);
        PlayerService.seek(currentTime);
    };

    const volumeIcon = (): JSX.Element | undefined => {
        if (volume == 0 || player.muted) {
            return <FaVolumeMute />;
        }

        if (volume > 0 && volume < 0.1) {
            return <FaVolumeOff />;
        }

        if (volume < 0.45) {
            return <FaVolumeDown />;
        }

        if (volume >= 0.45) {
            return <FaVolumeUp />;
        }
    };

    const handleVolume = (event: ChangeEvent): void => {
        const element = event.target as HTMLInputElement;
        const volume = element.valueAsNumber;
        setVolume(volume);
        PlayerService.volume(volume);
        PreviewService.volume(volume);
    };

    const artist = player.current?.artist ? player.current.artist : '-';
    const title = player.current?.title ? player.current.title : '-';
    const beatmapSetId = player.current?.beatmapset_id;

    return (
        <div className={styles.player}>
            <div className={styles.left}>
                <div className={styles.cover} style={getBackgroundImageStyle(coverPath)} />
                <div className={styles.metaData}>
                    <span className={styles.artist}>{artist}</span>
                    <span className={styles.title}>{title}</span>
                    <span className={styles.beatmapSetId}>
                        BEATMAPSET ID:
                        <span onClick={() => openBeatmapPage(beatmapSetId)}>{beatmapSetId}</span>
                    </span>
                </div>
            </div>
            <div className={styles.center}>
                <div className={styles.controls}>
                    <span className={styles.option + (player.shuffled ? ' ' + styles.optionActive : '')} onClick={PlayerService.shuffle}><FaRandom /></span>
                    <span onClick={PlayerService.backward}><FaBackward /></span>
                    <span onClick={PlayerService.playPause}>
                        {
                            player.playing ?
                                <FaPause />
                                :
                                <FaPlay />
                        }
                    </span>
                    <span onClick={PlayerService.forward}><FaForward /></span>
                    <span className={styles.option}><FaRedoAlt /></span>
                </div>
                <div className={styles.track}>
                    <input type="range" min="0" max={duration} value={Math.round(currentTime)} onChange={handleDrag} onMouseDown={() => setDrag(true)} onMouseUp={seek} />
                </div>
                <div className={styles.timestamps}>
                    <span>{formatSeconds(currentTime)}</span>
                    <span>{formatSeconds(duration)}</span>
                </div>
            </div>
            <div className={styles.right}>
                <span>x1.0</span>
                <span className={styles.icon} onClick={PlayerService.mute}>{volumeIcon()}</span>
                <div className={styles.volume}>
                    <input type="range" min="0" step="0.01" max="0.52" value={PlayerService.volume()} onChange={handleVolume} />
                </div>
                <span className={styles.icon}><FaPollH /></span>
            </div>
        </div>
    );
};

export default PlayerBar;
