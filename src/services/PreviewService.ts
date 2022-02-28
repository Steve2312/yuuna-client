import PlayerService from "./PlayerService";
import Observable from "./Observable";
import thumbnail from '../assets/images/no_thumbnail.jpg';
import MediaSessionService from "./MediaSessionService";
import AudioService from "./AudioService";

class PreviewService extends Observable {

    private audio: HTMLAudioElement = new Audio();

    // Playback Propperties
    private playing: boolean = false;
    private beatmapSetID: number;
    private defaultAudioVolume: number = 0.24;
    private title: string;

    constructor() {
        super();
        this.audio.volume = this.defaultAudioVolume;
    }

    public playPreview = async (beatmapSetID: number, title: string) => {

        if (this.beatmapSetID == beatmapSetID) {
            this.playPause();
            return;
        }

        const source = `https://b.ppy.sh/preview/${beatmapSetID}.mp3`
        const volume = this.audio.volume;
        try {
            const audio = await AudioService.create(source, volume);
            
            // Set Handlers
            audio.onpause = this.handleOnPlayPause;
            audio.onplay = this.handleOnPlayPause;
            audio.ontimeupdate = this.handleOnTimeUpdate;

            // Pause old playback
            this.pause();

            // Play new audio
            this.audio = audio;
            this.play();

            // Update state
            this.beatmapSetID = beatmapSetID;
            this.title = title;
            this.updateMediaSession();

            this.notify(this.getState());

            // Pause Player
            PlayerService.pause();
        } catch (err) {
            console.error(err)
        }
    }

    public play = () => {
        PlayerService.pause();
        this.audio.play();
    }

    public pause = () => {
        this.audio.pause();
    }

    public playPause = () => {
        this.playing ? this.pause() : this.play();
    }

    public volume = (volume? :number): number => {
        if (volume != undefined) {
            this.audio.volume = volume;
        }

        return this.audio.volume;
    }

    public getState = () => {
        return {
            audio: this.audio,
            playing: this.playing,
            beatmapSetID: this.beatmapSetID
        }
    }

    public updateMediaSession = async () => {
        const beatmapSetID = this.beatmapSetID.toString();
        const coverPath = `https://assets.ppy.sh/beatmaps/${beatmapSetID}/covers/list@2x.jpg`;

        MediaSessionService.display(this.title, "Yuuna Preview", coverPath);

        const mediaSession = MediaSessionService.getMediaSession();

        if (mediaSession) {
            mediaSession.setActionHandler("previoustrack", null);
            mediaSession.setActionHandler("nexttrack", null);
            mediaSession.setActionHandler("play", this.play);
            mediaSession.setActionHandler("pause", this.pause);
        }
    }

    // Event Handlers 
    private handleOnPlayPause = (event: Event) => {
        const audio = event.target as HTMLAudioElement;
        MediaSessionService.setPlaybackState(audio.paused ? 'paused' : 'playing')
        this.playing = !audio.paused;
        this.notify(this.getState());

        if (MediaSessionService.getMediaSession().metadata?.title != this.title) {
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
                this.beatmapSetID = -1;
                this.notify(this.getState());

                audio.pause();
                
                PlayerService.updateMediaSession();
                PlayerService.getState().audio.play();
                PlayerService.getState().audio.pause();
            }

        }
    }
}

export default new PreviewService();