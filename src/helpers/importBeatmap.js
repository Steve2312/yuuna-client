import Electron from "electron";
import path from 'path';
import request from "request";
import fs from 'fs';
import { unzip, getFilesInDirectory, readFile, pathExists, createDirectory, moveFile, createFile, deleteDirectory } from "./filesystem";
import { updateLibrary } from "./LibraryHandler";
import { v4 as uuidv4 } from 'uuid';

export const importBeatmap = async (pipePath) => {
    const appData = Electron.remote.app.getAppPath();
    const songsPath = path.join(appData, "songs");

    const extractPath = await unzip(pipePath);
    if (!extractPath) {
        return;
    }

    const osuFiles = Array.from(await getFilesInDirectory(extractPath)).filter(data => data.split(".").pop() == "osu");

    const audioFiles = [];
    const mapsToImport = [];

    for (let x = 0; x < osuFiles.length; x++) {
        const osuFile = osuFiles[x];
        const osuFilePath = path.join(extractPath, osuFile);
        const beatmapData = parseMapToObject(await readFile(osuFilePath));
        const audioFilename = beatmapData.general.AudioFilename;

        if (!audioFiles.includes(audioFilename)) {
            audioFiles.push(audioFilename);
            mapsToImport.push({
                audio: audioFilename,
                artist: beatmapData.metadata.Artist,
                title: beatmapData.metadata.Title,
                source: beatmapData.metadata.Source ? beatmapData.metadata.Source : null,
                duration: await getDuration(path.join(extractPath, audioFilename)),
                creator: beatmapData.metadata.Creator,
                bpm: calculateBPM(beatmapData.timingpoints),
                beatmapset_id: beatmapData.metadata.BeatmapSetID ? beatmapData.metadata.BeatmapSetID : null,
                id: uuidv4(),
                date_added: Date.now()
            });
        }
    }
    
    console.log(mapsToImport);

    if (!pathExists(songsPath)) {
        createDirectory(songsPath);
    }

    await Promise.all(mapsToImport.map(async (map) => {
        const beatmapPath = await createDirectory(path.join(songsPath, map.id));
        const oldAudioPath = path.join(extractPath, map.audio);
        const newAudioPath = path.join(beatmapPath, map.audio);
        await moveFile(oldAudioPath, newAudioPath);

        const metadataPath = path.join(beatmapPath, "metadata.json");
        await createFile(JSON.stringify(map), metadataPath);

        const coverPath = path.join(beatmapPath, "cover.jpg");
        request(`https://assets.ppy.sh/beatmaps/${map.beatmapset_id}/covers/list@2x.jpg`).pipe(fs.createWriteStream(coverPath));

        const headerPath = path.join(beatmapPath, "header.jpg");
        request(`https://assets.ppy.sh/beatmaps/${map.beatmapset_id}/covers/card@2x.jpg`).pipe(fs.createWriteStream(headerPath));

        deleteDirectory(extractPath);
    }));

    updateLibrary();
}

function parseMapToObject(file) {
    const lines = file.split("\r\n");

    const data = {};

    var header;
    lines.forEach(line => {
        if (line) {
            if (line.startsWith("[") && line.endsWith("]")) {
                header = line.substr(1, line.length - 2).toLowerCase();
                data[header] = {};
                return;
            }

            if (!header) {
                data["file_format"] = line;
                return;
            }

            const value = parseLineOfMap(line);

            if (typeof value == "object") {
                data[header] = {...data[header], ...value};
            }

            if (typeof value == "string") {
                try {
                    data[header].push(value);
                } catch {
                    data[header] = [];
                    data[header].push(value);
                }
            }
        }
    });
    return data;
}


function parseLineOfMap(line) {
    const seperators = [" : ", ": ", ":"];
    for (let x = 0; x < seperators.length; x++) {
        const seperator = seperators[x];
        const pair = line.split(seperator);
        if (pair.length > 1) {
            var object = {};
            object[pair.shift()] = pair.join(seperator);
            return object;
        }
    }
    return line;
}

function calculateBPM(timingpoints) {
    var calculations = [];
    for (let x = 0; x < timingpoints.length; x++) {
        const timingpoint = timingpoints[x];
        const beatTime = parseFloat(timingpoint.split(",")[1]);
        if (beatTime > 0) {
            const bpm = Math.round(60000 / beatTime * 100) / 100;
            calculations.push(bpm);
        }
    }
    return Math.max(...calculations);
}

function getDuration(audioFilePath) {
    return new Promise(resolve => {
        const audio = document.createElement('audio');
        audio.src = audioFilePath;
        audio.onloadedmetadata = () => {
            const duration = audio.duration;
            audio.remove();
            resolve(duration);
        }
    });
}