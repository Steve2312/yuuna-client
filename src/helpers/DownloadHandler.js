import request from "request";
import progress from 'request-progress';
import path from 'path';
import Electron from "electron";
import fs from 'fs';
import {importBeatmap} from './importBeatmap';
import { pathExists } from './filesystem';

const appData = Electron.remote.app.getAppPath();
const tempPath = path.join(appData, "temp");

const downloadQueue = [];
var downloadRequest;

var setDownloadQueue = null;
var setDownloadProgress = null;

export const addToDownloadQueue = (beatmap) => {
    if (inQueue(beatmap.id)) {
        console.log("Beatmap already in download queue");
        // Remove beatmap
        return;
    }

    downloadQueue.push(beatmap);
    setDownloadQueue([...downloadQueue]);

    download();
};

function download() {

    checkTemp();

    if (!downloadRequest) {
        const {id, unique_id} = downloadQueue[0];
        const pipePath = path.join(tempPath, id + '.zip');
        
        downloadRequest = request('https://beatconnect.io/b/'+ id +'/' + unique_id + '/');

        progress(downloadRequest).on("progress", (state) => {
            updateProgress(id, state.speed, state.percent, false);
        }).on("end", async () => {
            updateProgress(id, 0, 0, true);
            await importBeatmap(pipePath);
            checkDownload();
        }).on("error", (err) => {
            console.error(err);
            checkDownload();
        }).pipe(fs.createWriteStream(pipePath));
    }
}

function updateProgress(id, speed, percent, importing) {
    setDownloadProgress({id, speed, percent, importing});
}

/**
 * Check if temp directory exists
 * If not, create the folder.
 */
function checkTemp() {
    if (!pathExists(tempPath)){
        fs.mkdirSync(tempPath);
    }
}

/**
 * Checks if queue is not empty
 * Then Download first one in queue.
 */
function checkDownload() {
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
export const inQueue = (id) => {
    for (let x = 0; x < downloadQueue.length; x++) {
        const beatmap = downloadQueue[x];
        if (beatmap.id === id) {
            return true;
        }
    }
    return false;
}

export const setSetters = (queue, progress) => {
    setDownloadQueue = queue;
    setDownloadProgress = progress;
}

export default {addToDownloadQueue, inQueue, setSetters};