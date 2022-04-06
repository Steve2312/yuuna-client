import Observable from "./Observable";
import axios from "axios";

class PreviewService extends Observable {

    private playing: boolean = false;
    private loading: boolean = false;
    private beatmapSetID: number;

    private defaultAudioVolume: number = 0.24;

    private audioContext = new AudioContext();
    private gainNode = this.audioContext.createGain();
    private audioBufferSource: AudioBufferSourceNode | null;

    private cancelToken = axios.CancelToken;
    private source = this.cancelToken.source();

    constructor() {
        super();
        this.gainNode.gain.value = this.defaultAudioVolume;
    }

    public playPreview = async (beatmapSetID: number): Promise<void> => {

        if (this.audioBufferSource) {
            this.audioBufferSource.onended = null;
            await this.audioBufferSource.stop();
        }

        this.abortFetch();
        this.handleAudioOnInitialize(beatmapSetID);

        const url = `https://b.ppy.sh/preview/${beatmapSetID}.mp3`;

        try {
            const arrayBuffer = await this.fetchArrayBuffer(url);
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            this.audioBufferSource = this.createAudioBufferSource(audioBuffer);
            this.audioBufferSource.onended = this.handleAudioOnEnd;

            this.gainNode.connect(this.audioContext.destination);
            this.audioBufferSource.start();

            this.handleAudioOnPlay();
        } catch(error) {
            if (!axios.isCancel(error)) {
                this.handleAudioOnEnd();
                console.error(error);
            }
        }
    }

    public play = () => {
        this.gainNode.connect(this.audioContext.destination)
        this.playing = true;
        this.notify(this.getState());
    }

    public pause = async () => {
        this.gainNode.disconnect();
        this.playing = false;
        this.notify(this.getState());
    }

    public playPause = () => {
        this.playing ? this.pause() : this.play();
    }

    public volume = (volume? :number): number => {
        if (volume != undefined) {
            this.gainNode.gain.value = volume;
        }

        return this.gainNode.gain.value;
    }

    private handleAudioOnInitialize = (beatmapSetID: number) => {
        this.beatmapSetID = beatmapSetID;
        this.loading = true;
        this.playing = true;
        this.notify(this.getState());
    }

    private handleAudioOnPlay = () => {
        this.loading = false;
        this.notify(this.getState());
    }

    private handleAudioOnEnd = () => {
        this.beatmapSetID = -1;
        this.playing = false;
        this.notify(this.getState());
    }

    private fetchArrayBuffer = async (url: string): Promise<ArrayBuffer> => {
        const response = await axios.get(url, {
            responseType: "arraybuffer",
            cancelToken: this.source.token
        });

        return response.data;
    }

    private createAudioBufferSource = (buffer: AudioBuffer) => {
        const audioBufferSource = this.audioContext.createBufferSource();
        audioBufferSource.buffer = buffer;
        audioBufferSource.connect(this.gainNode);
        return audioBufferSource;
    }

    private abortFetch = () => {
        if (this.loading) {
            this.loading = false;
            this.source.cancel();
            this.cancelToken = axios.CancelToken;
            this.source = this.cancelToken.source();
        }
    }

    public getState = () => {
        return {
            playing: this.playing,
            loading: this.loading,
            beatmapSetID: this.beatmapSetID
        }
    }
}

export default new PreviewService();