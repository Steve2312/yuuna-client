import Electron from "electron";
import { lstatSync } from "fs";
import path from 'path';
import { pathExists, getFilesInDirectory, readFile } from "./filesystem";

export const updateLibrary = async () => {
    console.log(await getLibrary());
}

export const getLibrary = async () => {
    console.time('getLibrary');
    const appData = Electron.remote.app.getAppPath();
    const songsPath = path.join(appData, "songs");

    const songs = await getFilesInDirectory(songsPath);
    console.log(songs);

    const library = [];

    songs.forEach( async (uuid) => {
        const songPath = path.join(songsPath, uuid);
        if (lstatSync(songPath).isDirectory()) {
            const metadataPath = path.join(songPath, "metadata.json");
            if (pathExists(metadataPath)) {
                const metadata = JSON.parse(await readFile(metadataPath));
                library.push(metadata);
            }
        }
    });

    console.timeEnd('getLibrary');
    return library;
}