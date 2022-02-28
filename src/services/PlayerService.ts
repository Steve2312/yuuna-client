import Song from '../interfaces/Song';
import { songsPath } from '../helpers/paths';
import path from 'path';
import PreviewService from './PreviewService';
import AudioService from './AudioService';
import MediaSessionService from './MediaSessionService';
import Observable from './Observable';

class PlayerService extends Observable {

    private audio: HTMLAudioElement = new Audio();

    // Playback Propperties
    private playing: boolean = false;
    private shuffled: boolean = false;
    private muted: boolean = false;

    private defaultAudioVolume: number = 0.24;
    private volumeBeforeMute: number = 0;

    // Info
    private playlistName: string;
    private playlist: Song[];

    private current: Song = {
        audio: '',
        artist: '',
        title: '',
        version: '',
        source: '',
        duration: 0,
        creator: '',
        bpm: '',
        beatmapset_id: 0,
        id: '',
        date_added: 0
    };

    constructor() {
        super();
        this.audio.volume = this.defaultAudioVolume;
    }

    public play = () => {
        PreviewService.pause();
        
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
            this.audio.paused ? this.play() : this.pause();
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
            this.audio.volume = volume;
            this.muted = volume == 0;
            this.notify(this.getState());
        }

        return this.audio.volume;
    }

    public forward = async () => {
        const index = this.getNextPlaylistPosition();
        if (index != -1) {
            await this.playAtPosition(index);
        
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
                this.playAtPosition(index);
            }
        }

        this.seek(0);
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

        this.notify(this.getState());
    }

    public playAtPosition = async (index: number) => {

        const song: Song = this.playlist[index];
        const songPath = path.join(songsPath, song.id, song.audio);
        const volume = this.audio.volume;

        try {
            const audio = await AudioService.create(songPath, volume);

            // Set Handlers
            audio.onplay = this.handleOnPlayPause;
            audio.onpause = this.handleOnPlayPause;
            audio.ontimeupdate = this.handleOnTimeUpdate;

            // Pause old playback
            this.pause();

            // Play new audio
            this.audio = audio;
            this.play();

            // Update state
            this.current = song;
            this.updateMediaSession();

            this.notify(this.getState());

            // Pause Preview
            PreviewService.pause();

        } catch (err) {
            console.error(err);
        }
    }

    public playFromPlaylist = async (playlistName: string, playlist: Song[], index: number) => {

        const song: Song = playlist[index];
        const songPath = path.join(songsPath, song.id, song.audio);
        const volume = this.audio.volume;

        if (this.current.id == song.id) {
            this.playPause();
            return;
        }

        try {
            const audio = await AudioService.create(songPath, volume);

            // Set Handlers
            audio.onplay = this.handleOnPlayPause;
            audio.onpause = this.handleOnPlayPause;
            audio.ontimeupdate = this.handleOnTimeUpdate;

            // Pause old playback
            this.pause();

            // Pause Preview
            PreviewService.pause();

            // Play new audio
            this.audio = audio;
            this.play();

            // Update state
            this.playlistName = playlistName;
            this.playlist = playlist;
            this.current = song;
            this.updateMediaSession();

            // Reshuffle Playlist
            if (this.shuffled) {
                this.shufflePlaylist();
            }

            this.notify(this.getState());

        } catch (err) {
            console.error(err);
        }
    }

    public updateMediaSession = async () => {
        const coverPath = path.join(songsPath, this.current.id, "cover.jpg");
        MediaSessionService.display(this.current.title, this.current.artist, coverPath);

        const mediaSession = MediaSessionService.getMediaSession();

        if (mediaSession) {
            mediaSession.setActionHandler("previoustrack", this.backward);
            mediaSession.setActionHandler("nexttrack", this.forward);
            mediaSession.setActionHandler("play", this.play);
            mediaSession.setActionHandler("pause", this.pause);
        }
    }

    // TODO
    public shuffle = () => {
        // TODO
    }

    private shufflePlaylist = () => {
        // TODO
    }

    private sortPlaylist = () => {
        // TODO
    }

    // Event Handlers 
    private handleOnPlayPause = (event: Event) => {
        const audio = event.target as HTMLAudioElement;
        MediaSessionService.setPlaybackState(audio.paused ? 'paused' : 'playing')
        this.playing = !audio.paused;
        this.notify(this.getState());

        if (MediaSessionService.getMediaSession().metadata?.title != this.current.title) {
            this.updateMediaSession();
        }
    }

    private handleOnTimeUpdate = (event: Event) => {
        const audio = event.target as HTMLAudioElement;
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

    // Index Calculation 
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
            if (song.id == this.current.id) {
                return i;
            }
        }

        return -1;
    }

    public getState = () => {
        return {
            audio: this.audio,
            playing: this.playing,
            shuffled: this.shuffled,
            muted: this.muted,
            playlistName: this.playlistName,
            playlist: this.playlist,
            artist: this.current.artist,
            title: this.current.title,
            beatmapSetID: this.current.beatmapset_id,
            id: this.current.id
        }
    }

}

export default new PlayerService();