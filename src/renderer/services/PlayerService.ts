import Song from "../types/Song";
import {getCoverPath, getSongPath} from "@/utils/Paths";
import MediaSessionService from "./MediaSessionService";
import Observable from "./Observable";
import PreviewService from "@/services/PreviewService";

class PlayerService extends Observable {

    private audio: HTMLAudioElement = new Audio();

    private playing = false;
    private shuffled = false;
    private muted = false;

    private defaultAudioVolume = 0.24;
    private volumeBeforeMute = 0;

    // Info
    private playlistName: string;
    private playlist: Song[];

    private current: Song;

    constructor() {
        super();
        this.audio.volume = this.defaultAudioVolume;
    }

    public play = async () => {
        if (this.audio.src) {
            await this.audio.play();
        }
    };

    public pause = async () => {
        if (this.audio.src) {
            await this.audio.pause();
        }
    };

    public playPause = () => {
        if (this.audio) {
            this.audio.paused ? this.play() : this.pause();
        }
    };

    public seek = (time?: number) => {

        if (time != undefined) {
            this.audio.currentTime = time;
        }

        return this.audio.currentTime;
    };

    public volume = (volume?: number): number => {

        if (volume != undefined) {
            this.audio.volume = volume;
            this.muted = volume == 0;
            this.notify(this.getState());
        }

        return this.audio.volume;
    };

    public forward = async () => {
        const index = this.getNextIndexOfSongInPlaylist();
        if (index != -1) {
            await this.playAtPosition(index);
        
            if (index == 0) {
                await this.pause();
            }
        }
    };

    public backward = async () => {
        const threshold = 0.5;
        const currentTime = this.audio.currentTime;

        if (currentTime < threshold) {
            const index = this.getPreviousIndexOfSongInPlaylist();

            if (index != -1) {
                await this.playAtPosition(index);
                return;
            }
        }

        this.seek(0);
    };

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
    };

    public playAtPosition = async (index: number) => {
        const song: Song = this.playlist[index];
        const songPath = getSongPath(song);
        const volume = this.audio.volume;

        try {
            const audio = await this.getPlayableAudioElement(songPath, volume);

            // Set Handlers
            audio.onplay = this.handleOnPlay;
            audio.onpause = this.handleOnPause;
            audio.ontimeupdate = this.handleOnTimeUpdate;

            // Pause old playback
            await this.pause();

            // Play new audio
            this.audio = audio;
            await this.play();

            // Update state
            this.current = song;
            await this.updateMediaSession();

            this.notify(this.getState());
        } catch (err) {
            console.error(err);
        }
    };

    public playFromPlaylist = async (playlistName: string, playlist: Song[], index: number) => {
        const song: Song = playlist[index];
        const songPath = getSongPath(song);
        const volume = this.audio.volume;

        if (this.current?.id == song.id) {
            this.playPause();
            return;
        }

        try {
            const audio = await this.getPlayableAudioElement(songPath, volume);

            // Set Handlers
            audio.onplay = this.handleOnPlay;
            audio.onpause = this.handleOnPause;
            audio.ontimeupdate = this.handleOnTimeUpdate;

            // Pause old playback
            await this.pause();

            // Play new audio
            this.audio = audio;
            await this.play();

            // Update state
            this.playlistName = playlistName;
            this.playlist = playlist;
            this.current = song;

            await this.updateMediaSession();

            // Reshuffle Playlist
            if (this.shuffled) {
                this.shufflePlaylist();
            }

            this.notify(this.getState());

        } catch (err) {
            console.error(err);
        }
    };

    public updateMediaSession = async () => {
        const coverPath = getCoverPath(this.current);
        await MediaSessionService.display(this.current.title, this.current.artist, coverPath);

        const mediaSession = MediaSessionService.getMediaSession();

        if (mediaSession) {
            mediaSession.setActionHandler("previoustrack", this.backward);
            mediaSession.setActionHandler("nexttrack", this.forward);
            mediaSession.setActionHandler("play", this.play);
            mediaSession.setActionHandler("pause", this.pause);
        }
    };

    // TODO
    public shuffle = () => {
        this.shuffled ? this.sortPlaylist() : this.shufflePlaylist();
    };

    private shufflePlaylist = () => {
        if (this.playlist && this.current) {
            const current = this.current;
            const shuffledPlaylist = this.playlist.filter(song => song != current)
                .sort(() => Math.random() - 0.5);

            shuffledPlaylist.unshift(current);

            this.playlist = shuffledPlaylist;
        }

        this.shuffled = true;
        this.notify(this.getState());
    };

    private sortPlaylist = () => {
        if (this.playlist) {
            this.playlist = this.playlist.sort((a, b) => a.index - b.index);
        }
        
        this.shuffled = false;
        this.notify(this.getState());
    };

    // Event Handlers
    private handleOnPlay = async (event: Event) => {
        this.playing = true;
        this.notify(this.getState());

        MediaSessionService.setPlaybackState("playing");

        const preview = PreviewService.getState();

        if (preview.playing) {
            PreviewService.pause();
        }

        if (preview.loading) {
            PreviewService.cancelAxiosRequest();
        }
    };

    private handleOnPause = async () => {
        this.playing = false;
        MediaSessionService.setPlaybackState("paused");
        this.notify(this.getState());
    };

    private handleOnTimeUpdate = async (event: Event) => {
        const audio = event.target as HTMLAudioElement;
        // Time Left before forwarding!
        const threshold = 0.4;

        const duration = audio.duration;
        const timeLeft = duration - audio.currentTime;

        if (duration && timeLeft <= threshold) {
            
            audio.currentTime = duration - threshold;

            if (!audio.paused) {
                audio.ontimeupdate = null;
                await this.forward();
            }

        }
    };

    private getNextIndexOfSongInPlaylist = (): number => {
        const index = this.getIndexOfSongInPlaylist();

        if (index == -1) {
            return index;
        }

        return (index + 1) % this.playlist.length;
    };

    private getPreviousIndexOfSongInPlaylist = (): number => {
        const index = this.getIndexOfSongInPlaylist();
        
        if (index == -1) {
            return index;
        }

        return index - 1 == -1 ? this.playlist.length - 1 : index - 1;
    };

    private getIndexOfSongInPlaylist = (): number => {
        for (let i = 0; i < this.playlist.length; i++) {
            const song = this.playlist[i];
            if (song.id == this.current.id) {
                return i;
            }
        }

        return -1;
    };

    private getPlayableAudioElement = (src: string, volume: number): Promise<HTMLAudioElement> => {
        return new Promise((resolve, reject) => {
            const audio = new Audio();

            audio.volume = volume;

            audio.addEventListener("canplay", () => {
                resolve(audio);
            }, {
                once: true
            });

            audio.addEventListener("error", (error: ErrorEvent) => {
                reject(error);
            }, {
                once: true
            });

            audio.src = src;
        });
    };

    public getState = () => {
        return {
            audio: this.audio,
            playing: this.playing,
            shuffled: this.shuffled,
            muted: this.muted,
            playlistName: this.playlistName,
            playlist: this.playlist,
            current: this.current
        };
    };
}

export default new PlayerService();