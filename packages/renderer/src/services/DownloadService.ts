import Observable from "@/services/Observable";
import Beatmap from "@/interfaces/Beatmap";
import {ipcRenderer} from "electron";


type Download = {
    beatmap: Beatmap,
    percentage: number | null,
    cancel: Function | null,
    status: "Waiting" | "Downloading" | "Importing"
}

class DownloadService extends Observable {

    private MAX_SIMULTANEOUS_DOWNLOADS = 5;

    private downloading: Download[] = [];
    private waiting: Download[] = [];

    private running: Boolean = false;

    public download = (beatmap: Beatmap) => {
        this.addToWaiting(beatmap)
        this.downloadHandler();
    }

    public downloadHandler = () => {
        if (!this.running && this.downloading.length < this.MAX_SIMULTANEOUS_DOWNLOADS) {

            const download = this.waiting.shift();

            if (download) {
                console.log("Sent to main thread")
                ipcRenderer.send("download-beatmap", {
                    beatmap: download.beatmap
                });

            }
            // Create a Download
            // Add Callback
            // Check for other in queue
        }
    }

    private addToWaiting = (beatmap: Beatmap) => {

        const isWaiting = this.waiting.find(waiting => waiting.beatmap.id == beatmap.id);

        if (!isWaiting) {
            this.waiting.push({
                beatmap: beatmap,
                cancel: null,
                percentage: null,
                status: "Waiting"
            });
        }
    }

    public getState = () => {
        return {

        }
    }
}

export default new DownloadService();