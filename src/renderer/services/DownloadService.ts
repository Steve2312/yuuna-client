import Observable from '@/services/Observable';
import Beatmap from '@/types/Beatmap';
import axios from 'axios';
import * as fs from 'fs';
import { getTempOutputPath } from '@/utils/Paths';
import Download from '@/types/Download';

export type DownloadServiceStateProps = {
    downloads: Download[]
}

class DownloadService extends Observable<DownloadServiceStateProps> {

    // Chrome allows a maximum of 6 connections per domain.
    // Leave 1 connection open for fetching data
    private MAX_SIMULTANEOUS_DOWNLOADS = 5;

    private downloads: Download[] = [];

    public download = (beatmap: Beatmap): void => {
        this.addToDownloads(beatmap);
        this.downloadHandler();
    };

    public downloadHandler = (): void => {

        if (this.getAllDownloading().length < this.MAX_SIMULTANEOUS_DOWNLOADS) {
            const download = this.getNextWaitingInDownloads();

            if (download) {
                download.status = 'Initializing';

                const beatmap = download.beatmap;
                const downloadURL = this.getDownloadURL(beatmap);
                const outputPath = getTempOutputPath(beatmap);


                axios.get(downloadURL, {
                    responseType: 'arraybuffer',
                    onDownloadProgress: (progress) => {
                        this.onDownloadProgress(download, progress);
                    }
                }).then(response => {
                    console.log(outputPath);
                    fs.promises.writeFile(outputPath, Buffer.from(response.data)).then(async () => {
                        await this.onFinishedDownloading(download);
                    });
                }).catch(() => this.onDownloadError(download));
            }
        }
    };

    private onDownloadProgress = (download: Download, progress: {loaded: number, total: number}): void => {
        download.status = 'Downloading';
        download.percentage = progress.loaded / progress.total * 100;
        this.notify(this.getState());
    };

    private onFinishedDownloading = async (download: Download): Promise<void> => {
        download.status = 'Importing';
        this.notify(this.getState());
        // Send path to Library service

        this.downloads.splice(this.downloads.indexOf(download), 1);
        this.notify(this.getState());

        this.downloadHandler();
    };

    private onDownloadError = (download: Download): void => {
        download.status = 'Failed';
        this.notify(this.getState());

        this.downloadHandler();
    };

    private addToDownloads = (beatmap: Beatmap): void => {

        const duplicateDownload = this.downloads.find(download => download.beatmap.id == beatmap.id);

        if (!duplicateDownload) {
            this.downloads.unshift({
                beatmap: beatmap,
                percentage: null,
                status: 'Waiting'
            });
        } else if (duplicateDownload.status == 'Failed') {
            duplicateDownload.percentage = null;
            duplicateDownload.status = 'Waiting';
        }

        this.notify(this.getState());
    };

    private getAllDownloading = (): Download[] => {
        return this.downloads.filter(download => {
            return download.status == 'Downloading' || download.status == 'Initializing';
        });
    };

    private getNextWaitingInDownloads = (): Download | null => {
        for (let i = 0; i < this.downloads.length; i++) {
            const download = this.downloads[i];
            if (download.status == 'Waiting') {
                return download;
            }
        }

        return null;
    };

    private getDownloadURL = (beatmap: Beatmap): string => {
        return 'https://beatconnect.io/b/' + beatmap.id + '/' + beatmap.unique_id;
    };

    public getState = (): DownloadServiceStateProps => {
        return {
            downloads: [...this.downloads]
        };
    };
}

export default new DownloadService();