import request from "request";
import progress from 'request-progress';
import path from 'path';
import fs from 'fs';
import {importBeatmap} from './importBeatmap';
import { pathExists } from './fileSystem';
import { tempPath } from "./paths";

const observers = [];

const downloadData = {
    queue: [],
    progress: {
        speed: null,
        id: null,
        percent: null,
        importing: false,
    }
};

var downloadRequest;


export const addToDownloadQueue = (beatmap) => {
    if (inQueue(beatmap.id)) {
        console.log("Beatmap already in download queue");
        return;
    }

    downloadData.queue.push(beatmap);
    notifyObservers();

    download();
};

function download() {

    checkTemp();

    if (!downloadRequest) {
        const {id, unique_id} = downloadData.queue[0];
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
    downloadData.progress.id = id;
    downloadData.progress.speed = speed;
    downloadData.progress.percent = percent;
    downloadData.progress.importing = importing;
    notifyObservers();
}

function checkTemp() {
    if (!pathExists(tempPath)){
        fs.mkdirSync(tempPath);
    }
}

function checkDownload() {
    downloadData.queue.shift();
    downloadRequest = null;
    if (!downloadData.queue.length == 0) {
        download();
    }
    notifyObservers();
}

/**
 * Checks if the beatmap is in the download queue.
 * @param {*} id Beatmap ID
 * @returns Boolean
 */
export const inQueue = (id) => {
    for (let x = 0; x < downloadData.queue.length; x++) {
        const beatmap = downloadData.queue[x];
        if (beatmap.id === id) {
            return true;
        }
    }
    return false;
}

const addObserver = (observer) => {
    observers.push(observer);
}

const removeObserver = (observer) => {
    const index = observers.indexOf(observer);
    if (index > -1) {
        observers.splice(index, 1);
    }
}

const notifyObservers = () => {
    for (let x = 0; x < observers.length; x++) {
        const update = observers[x];
        update({...downloadData});
    }
}

const getDownloadData = () => {
    return downloadData;
}

export default {addToDownloadQueue, inQueue, addObserver, removeObserver, notifyObservers, getDownloadData};