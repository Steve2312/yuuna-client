import Observable from "./Observable";
import axios from "axios";
import PlayerService from "@/services/PlayerService";

class PreviewService extends Observable {

    private playing = false;
    private loading = false;
    private beatmapSetID: number | null;

    private defaultAudioVolume = 0.24;

    private audioContext = new AudioContext();
    private gainNode = this.audioContext.createGain();
    private audioBufferSource: AudioBufferSourceNode | null;

    private cancelTokenSource = axios.CancelToken.source();

    constructor() {
        super();

        this.gainNode.gain.value = this.defaultAudioVolume;
    }

    public playPreview = async (beatmapSetID: number): Promise<void> => {

        await PlayerService.pause();

        if (this.loading) this.cancelAxiosRequest();

        this.destroyAudioBufferSource();
        this.notifyLoading(beatmapSetID);

        const url = `https://b.ppy.sh/preview/${beatmapSetID}.mp3`;

        try {
            const arrayBuffer = await this.getArrayBuffer(url);
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.audioBufferSource = this.createAudioBufferSource(audioBuffer);
            this.audioBufferSource.onended = this.notifyFinishedPlaying;
            this.gainNode.connect(this.audioContext.destination);
            this.audioBufferSource.start();
            this.notifyFinishedLoading();
        } catch(error) {
            if (!axios.isCancel(error)) {
                console.error(error);
                this.notifyFinishedPlaying();
            }
        }
    };

    public play = async () => {
        await PlayerService.pause();
        this.gainNode.connect(this.audioContext.destination);
        this.notifyPlaying();
    };

    public pause = () => {
        this.gainNode.disconnect();
        this.notifyPaused();
    };

    public playPause = () => {
        this.playing ? this.pause() : this.play();
    };

    public volume = (volume? :number): number => {
        if (volume != undefined) {
            this.gainNode.gain.value = volume;
        }

        return this.gainNode.gain.value;
    };

    private getArrayBuffer = async (url: string): Promise<ArrayBuffer> => {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            cancelToken: this.cancelTokenSource.token
        });

        return response.data;
    };

    private createAudioBufferSource = (buffer: AudioBuffer) => {
        const audioBufferSource = this.audioContext.createBufferSource();
        audioBufferSource.buffer = buffer;
        audioBufferSource.connect(this.gainNode);
        return audioBufferSource;
    };

    public cancelAxiosRequest =  () => {
        this.cancelTokenSource.cancel();
        this.cancelTokenSource = axios.CancelToken.source();
        this.notifyFinishedPlaying();
    };

    private destroyAudioBufferSource = () => {
        if (this.audioBufferSource) {
            this.audioBufferSource.onended = null;
            this.audioBufferSource.stop();
        }
    };

    private notifyLoading = (beatmapSetID: number) => {
        this.beatmapSetID = beatmapSetID;
        this.loading = true;
        this.playing = true;
        this.notify(this.getState());
    };

    private notifyFinishedLoading = () => {
        this.loading = false;
        this.notify(this.getState());
    };

    private notifyFinishedPlaying = () => {
        this.beatmapSetID = null;
        this.playing = false;
        this.notify(this.getState());
    };

    private notifyPlaying = () => {
        this.playing = true;
        this.notify(this.getState());
    };

    private notifyPaused = () => {
        this.playing = false;
        this.notify(this.getState());
    };

    public getState = () => {
        return {
            playing: this.playing,
            loading: this.loading,
            beatmapSetID: this.beatmapSetID
        };
    };
}

export default new PreviewService();