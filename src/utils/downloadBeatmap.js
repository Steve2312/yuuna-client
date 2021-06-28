import {useContext} from 'react';
import request from "request";
import progress from 'request-progress';
import path from 'path';
import Electron from "electron";
import fs from 'fs';

const appData = Electron.remote.app.getAppPath();
const tempPath = path.join(appData, "temp");

var downloadQueue = [];
var downloadRequest;

var queueState;
var progressState;

export const addToDownloadQueue = (id, unique_id, title, artist) => {
    const setDownloadQueue = queueState[1];
    
    if (isQueued(id)) {
        console.log("Beatmap already in download queue");
        return;
    }

    downloadQueue.push({id, unique_id, title, artist})
    setDownloadQueue([...downloadQueue]);

    download();
};

function download() {

    checkTemp();

    if (!downloadRequest) {
        const {id, unique_id} = downloadQueue[0];
        const pipePath = path.join(tempPath, id + '.zip');

        console.log("Downloading: " + id);

        downloadRequest = request('https://beatconnect.io/b/'+ id +'/' + unique_id + '/');

        progress(downloadRequest).on("progress", (state) => {
            console.log(state.percent * 100 + "%");
            setProgress(id, state.speed, state.percent);
        }).on("end", () => {
            console.log("Finished downloading: " + id);
            checkDownload();
            // Import beatmap into library
        }).on("error", (err) => {
            console.error(err);
            checkDownload();
        }).pipe(fs.createWriteStream(pipePath));
    }
}

function setProgress(id, speed, percent) {
    const setProgress = progressState[1];
    setProgress({id, speed, percent});
}

/**
 * Check if temp directory exists
 * If not, create the folder.
 */
function checkTemp() {
    if (!fs.existsSync(tempPath)){
        fs.mkdirSync(tempPath);
    }
}

/**
 * Checks if queue is not empty
 * Then Download first one in queue.
 */
function checkDownload() {
    const setDownloadQueue = queueState[1];
    downloadQueue.shift();
    setDownloadQueue([...downloadQueue]);

    downloadRequest = null;
    if (!downloadQueue.length == 0) {
        download();
    }
}

/**
 * Checks if the beatmap is in the download queue.
 * @param {*} id Beatmap ID
 * @returns Boolean
 */
export const isQueued = (id) => {
    const [downloadQueue, setDownloadQueue] = queueState;
    var isQueued = false;
    downloadQueue.forEach(beatmap => {
        if (beatmap.id === id) {
            return isQueued = true;
        }
    });
    return isQueued;
}

export const setQueueState = (state) => {
    queueState = state;
}

export const setProgressState = (state) => {
    progressState = state;
}

export default {download, setQueueState, setProgressState};