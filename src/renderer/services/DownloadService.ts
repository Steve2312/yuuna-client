import Observable from "@/services/Observable";
import Beatmap from "@/interfaces/Beatmap";
import axios from "axios";
import * as fs from "fs";
import {getTempPath} from "@/utils/Paths";


type Download = {
    beatmap: Beatmap,
    percentage: number | null,
    cancel: Function | null,
    status: "Waiting" | "Downloading" | "Importing" | "Failed"
    timeAdded: number
}

class DownloadService extends Observable {

    private MAX_SIMULTANEOUS_DOWNLOADS = 5;

    private downloads: Download[] = [];

    public download = (beatmap: Beatmap) => {
        this.addToDownloads(beatmap)
        this.downloadHandler();
    }

    public downloadHandler = () => {

        // Check if 5 download are simultaniously running

        const download = this.downloads.shift();

        if (download) {

            const beatmap = download.beatmap;
            const downloadURL = this.getDownloadURL(beatmap);
            const output = getTempPath(beatmap);

            axios.get(downloadURL, {
                responseType: "arraybuffer",
                onDownloadProgress: (progress) => {
                    this.onDownloadProgress(beatmap, progress)
                }
            }).then(response => {
                fs.promises.appendFile(output, Buffer.from(response.data)).then(r => {
                    this.onFinishedDownloading(beatmap);
                });
            })

        }
    }

    private onDownloadProgress = (beatmap: Beatmap, progress: {loaded: number, total: number}) => {
        const percent = (progress.loaded / progress.total * 100).toFixed(2) + "%";
        console.log(beatmap.id, percent)
    }

    private onFinishedDownloading = (beatmap: Beatmap) => {
        // Send path to Library service
    }

    private addToDownloads = (beatmap: Beatmap) => {

        const duplicateDownload = this.downloads.find(download => download.beatmap.id == beatmap.id);

        if (!duplicateDownload) {
            this.downloads.push({
                beatmap: beatmap,
                cancel: null,
                percentage: null,
                status: "Waiting",
                timeAdded: Date.now()
            });
        }
    }

    private getDownloadURL = (beatmap: Beatmap) => {
        return "https://beatconnect.io/b/" + beatmap.id + "/" + beatmap.unique_id;
    }

    public getState = () => {
        return {

        }
    }
}

export default new DownloadService();