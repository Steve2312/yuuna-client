import Song from '../interfaces/Song';
import PreviewHandler from '../helpers/PreviewHandler';
import { songsPath } from '../helpers/paths';
import thumbnail from '../assets/images/no_thumbnail.jpg';
import path from 'path';

class PlayerService {

    private observers: Function[] = [];
    private audio: HTMLAudioElement = new Audio();

    // Playback Propperties
    private playing: boolean = false;
    private shuffled: boolean = false;
    private muted: boolean = false;

    private defaultAudioVolume: number = 0.24;
    private volumeBeforeMute: number = 0.24;
    // Info
    private playlistName: string;
    private playlist: Song[];

    private artist: string;
    private title: string;
    private beatmapSetID: number;
    private beatmapID: number;

    private mediaSession = navigator.mediaSession;

    private loading: boolean = false;

    constructor() {
        this.audio.volume = this.defaultAudioVolume;
        if (this.mediaSession) {
            this.mediaSession.setActionHandler("previoustrack", this.backward);
            this.mediaSession.setActionHandler("nexttrack", this.forward);
            this.mediaSession.setActionHandler("play", this.play);
            this.mediaSession.setActionHandler("pause", this.pause);
        }
    }

    public play = () => {
        if (this.audio) {
            this.audio.play();
        }
    }

    public pause = () => {
        if (this.audio) {
            this.audio.pause();
        }
    }

    public playPause = () => {
        if (this.audio) {
            this.audio.paused ? this.audio.play() : this.audio.pause();
        }
    }

    public seek = (time?: number) => {

        if (time != undefined) {
            this.audio.currentTime = time;
        }

        return this.audio.currentTime;
    }

    public volume = (volume?: number): number => {

        if (volume != undefined) {

            PreviewHandler.volume(volume);

            this.audio.volume = volume;
            this.muted = volume == 0;
            this.notify();
        }

        return this.audio.volume;
    }

    public forward = async () => {
        const index = this.getNextPlaylistPosition();

        if (index != -1) {
            await this.load(index);
        
            if (index == 0) {
                this.pause();
            }
        }
    }

    public backward = () => {
        const threshold = 0.5;
        const currentTime = this.audio.currentTime;

        if (currentTime < threshold) {
            const index = this.getPreviousPlaylistPosition();

            if (index != -1) {
                this.load(index);
            }
        }

        this.seek(0);
    }

    public shuffle = () => {
        // TODO
    }

    private shufflePlaylist = () => {
        // TODO
    }

    private sortPlaylist = () => {
        // TODO
    }

    private updateMediaSession = async () => {
        const beatmapID = this.beatmapID.toString();
        const coverPath = path.join(songsPath, beatmapID, "cover.jpg");
        let dataURL: string;

        try {
            dataURL = await this.imageToDataURL(coverPath);
        } catch {
            dataURL = await this.imageToDataURL(thumbnail);
        }

        if (this.mediaSession) {
            const metadata = new MediaMetadata({
                title: this.title,
                artist: this.artist,
                artwork: [
                    {
                        src: dataURL,
                        sizes: '512x512',
                        type: 'image/jpeg'
                    }
                ]
            });
            
            this.mediaSession.metadata = metadata;
        }
    }

    private imageToDataURL = async (path: string): Promise<string> => {
        const data = await fetch(path);
        const blob = await data.blob();
        return URL.createObjectURL(blob);
    }

    public mute = () => {
        if (this.muted) {
            this.volume(this.volumeBeforeMute);
            this.muted = false;
        } else {
            this.volumeBeforeMute = this.volume();
            this.volume(0);
            this.muted = true;
        }
        this.notify();
    }

    public load = async (index: number) => {
        
        if (this.loading) {
            return;
        }

        this.loading = true;

        const beatmap: Song = this.playlist[index];

        try {
            const src = path.join(songsPath, beatmap.id.toString(), beatmap.audio);
            const audio = await this.createAudio(src, true);

            this.audio = audio;
            this.artist = beatmap.artist;
            this.title = beatmap.title;
            this.beatmapSetID = beatmap.beatmapset_id;
            this.beatmapID = beatmap.id;
            
            this.pausePreview();
            this.updateMediaSession();
            this.notify();
        } catch (err) {
            console.error(err)
        }

        this.loading = false;
    }

    public loadPlaylist = async (playlistName: string, playlist: Song[], index: number) => {
        const beatmap: Song = playlist[index];

        if (beatmap.id == this.beatmapID) {
            this.playPause();
            return;
        }

        try {
            const src = path.join(songsPath, beatmap.id.toString(), beatmap.audio);
            const audio = await this.createAudio(src, true);

            this.audio = audio;
            this.playlistName = playlistName;
            this.playlist = playlist;
            this.artist = beatmap.artist;
            this.title = beatmap.title;
            this.beatmapSetID = beatmap.beatmapset_id;
            this.beatmapID = beatmap.id;

            if (this.shuffled) {
                this.shufflePlaylist();
            }
            this.pausePreview();
            this.updateMediaSession();
            this.notify();
        } catch (err) {
            console.error(err)
        }
    }

    private createAudio = (src: string, autoplay: boolean): Promise<HTMLAudioElement> => {
        return new Promise((resolve, reject) => {
            const audio: HTMLAudioElement = new Audio(src);

            audio.onpause = () => {
                if (this.mediaSession) {
                    this.mediaSession.playbackState = 'paused';
                }
                
                this.playing = false;
                this.notify();
            }

            audio.onplay = () => {
                if (this.mediaSession) {
                    this.mediaSession.playbackState = 'playing';
                }

                this.playing = true;
                this.notify();
            }
            
            audio.ontimeupdate = () => {
                this.handleTimeUpdate(audio);
            }

            audio.oncanplay = () => {
                audio.oncanplay = null;
                audio.volume = this.defaultAudioVolume;

                if (this.audio) {
                    audio.volume = this.audio.volume;
                    this.audio.onpause = null;
                    this.audio.pause();
                }

                if (autoplay) {

                    audio.play();
                }

                resolve(audio);
            }

            audio.onerror = (err) => {
                audio.onerror = null;
                reject(err);
            }

        });

    }

    private handleTimeUpdate = (audio: HTMLAudioElement) => {
        // Time Left before forwarding!
        const threshold = 0.4;

        const duration = audio.duration;
        const timeLeft = duration - audio.currentTime;

        if (duration && timeLeft <= threshold) {
            
            audio.currentTime = duration - threshold;

            if (!audio.paused) {
                audio.ontimeupdate = null;
                this.forward();
            }

        }
    }

    private pausePreview = () => {
        if (PreviewHandler.getPreview().playing) {
            PreviewHandler.pause();
        }
    }

    private getNextPlaylistPosition = (): number => {
        const index = this.getPlaylistPosition();

        if (index == -1) {
            return index;
        }

        return (index + 1) % this.playlist.length;
    }

    private getPreviousPlaylistPosition = (): number => {
        const index = this.getPlaylistPosition();
        
        if (index == -1) {
            return index;
        }

        return index - 1 == -1 ? this.playlist.length - 1 : index - 1;
    }

    private getPlaylistPosition = (): number => {
        for (let i = 0; i < this.playlist.length; i++) {
            const song = this.playlist[i];
            if (song.id == this.beatmapID) {
                return i;
            }
        }

        return -1;
    }

    public attach = (observer: Function) => {
        this.observers.push(observer);
    }

    public detach = (observer: Function) => {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    public notify = () => {
        for (let observer of this.observers) {
            observer(this.getState());
        }
    }

    public getState = () => {
        return {
            audio: this.audio,
            playing: this.playing,
            shuffled: this.shuffled,
            muted: this.muted,
            playlistName: this.playlistName,
            playlist: this.playlist,
            artist: this.artist,
            title: this.title,
            beatmapSetID: this.beatmapSetID,
            beatmapID: this.beatmapID
        }
    }

}

export default new PlayerService();