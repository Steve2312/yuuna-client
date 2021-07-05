import Electron from "electron";
import { lstatSync } from "fs";
import path from 'path';
import { pathExists, getFilesInDirectory, readFile } from "./filesystem";

var setLibrary = null;

export const updateLibrary = async () => {
    const library = await getLibrary();
    setLibrary(library);
}

export const getLibrary = async () => {
    console.time('Time to load library');
    const appData = Electron.remote.app.getAppPath();
    const songsPath = path.join(appData, "songs");
    const library = [];
    if (pathExists(songsPath)) {
        const songs = await getFilesInDirectory(songsPath);
        for (const uuid of songs) {
            const songPath = path.join(songsPath, uuid);
            if (lstatSync(songPath).isDirectory()) {
                const metadataPath = path.join(songPath, "metadata.json");
                if (pathExists(metadataPath)) {
                    const metadata = JSON.parse(await readFile(metadataPath));
                    library.push(metadata);
                }
            }
        }
    }
    console.timeEnd('Time to load library');
    return library;
}

export const setLibrarySetter = async (library) => {
    setLibrary = library;
}