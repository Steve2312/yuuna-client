import Observable from '@/services/Observable'
import Beatmap from '@/types/Beatmap'
import axios from 'axios'
import * as fs from 'fs'
import { getTempOutputPath } from '@/utils/Paths'
import Download, { DownloadStatus } from '@/types/Download'
import LibraryService from '@/services/LibraryService'

export type DownloadServiceStateProps = {
    downloads: Download[]
}

class DownloadService extends Observable<DownloadServiceStateProps> {

    // Chrome allows a maximum of 6 connections per domain.
    // Leave 1 connection open for fetching data
    private MAX_SIMULTANEOUS_DOWNLOADS = 5

    private downloads: Download[] = []

    public download = (beatmap: Beatmap): void => {
        this.addToDownloads(beatmap)
        this.downloadHandler()
    }

    public dequeue = (beatmap: Beatmap): void => {
        this.removeFromDownload(beatmap)
        this.downloadHandler()
    }

    private downloadHandler = (): void => {

        if (this.getAllDownloading().length < this.MAX_SIMULTANEOUS_DOWNLOADS) {
            const download = this.getNextWaitingInDownloads()

            if (download) {
                download.status = DownloadStatus.Initializing

                const beatmap = download.beatmap
                const downloadURL = this.getDownloadURL(beatmap)
                const outputPath = getTempOutputPath(beatmap)


                axios.get(downloadURL, {
                    responseType: 'arraybuffer',
                    onDownloadProgress: (progress) => {
                        this.onDownloadProgress(download, progress)
                    }
                }).then(response => {
                    fs.promises.writeFile(outputPath, Buffer.from(response.data)).then(async () => {
                        await this.onFinishedDownloading(download, outputPath)
                    })
                }).catch(() => this.onDownloadError(download))
            }
        }
    }

    private onDownloadProgress = (download: Download, progress: {loaded: number, total: number}): void => {
        download.status = DownloadStatus.Downloading
        download.percentage = progress.loaded / progress.total * 100
        this.notify(this.getState())
    }

    private onFinishedDownloading = async (download: Download, path: string): Promise<void> => {
        download.status = DownloadStatus.Importing
        this.notify(this.getState())

        await LibraryService.import(path)

        this.downloads.splice(this.downloads.indexOf(download), 1)
        this.notify(this.getState())

        this.downloadHandler()
    }

    private onDownloadError = (download: Download): void => {
        download.status = DownloadStatus.Failed
        this.notify(this.getState())

        this.downloadHandler()
    }

    private addToDownloads = (beatmap: Beatmap): void => {

        const duplicateDownload = this.downloads.find(download => download.beatmap.id == beatmap.id)

        if (!duplicateDownload) {
            this.downloads.unshift({
                beatmap: beatmap,
                percentage: null,
                status: DownloadStatus.Waiting
            })
        } else if (duplicateDownload.status == DownloadStatus.Failed) {
            duplicateDownload.percentage = null
            duplicateDownload.status = DownloadStatus.Waiting
        }

        this.notify(this.getState())
    }

    private removeFromDownload = (beatmap: Beatmap): void => {
        const download = this.downloads.find(download => download.beatmap.id == beatmap.id)

        if (download && (download.status == DownloadStatus.Waiting || download.status == DownloadStatus.Failed)) {
            this.downloads = this.downloads.filter(d => d != download)
            this.notify(this.getState())
        }
    }

    private getAllDownloading = (): Download[] => {
        return this.downloads.filter(download => {
            return download.status == DownloadStatus.Downloading || download.status == DownloadStatus.Initializing
        })
    }

    private getNextWaitingInDownloads = (): Download | null => {
        for (let i = 0; i < this.downloads.length; i++) {
            const download = this.downloads[i]
            if (download.status == DownloadStatus.Waiting) {
                return download
            }
        }

        return null
    }

    private getDownloadURL = (beatmap: Beatmap): string => {
        return 'https://beatconnect.io/b/' + beatmap.id + '/' + beatmap.unique_id
    }

    public getState = (): DownloadServiceStateProps => {
        return {
            downloads: [...this.downloads]
        }
    }
}

export default new DownloadService()