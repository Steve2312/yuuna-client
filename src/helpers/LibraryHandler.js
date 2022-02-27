import { lstatSync } from 'fs';
import path from 'path';
import { pathExists, getFilesInDirectory, readFile } from './fileSystem';
import PlayerService from '../services/PlayerService';
import { songsPath } from './paths';
const observers = [];

const library = {
    all: [],
};

export const updateLibrary = async () => {
    library.all = await loadLibrary();
    notifyObservers();

    if (PlayerService.getState().beatmapID == null && library.all.length > 0) {
        await PlayerService.loadPlaylist('library', library.all, 0);
        PlayerService.pause();
    }
};

const loadLibrary = async () => {
    console.time('Time to load library');
    const library = [];
    if (pathExists(songsPath)) {
        const songs = await getFilesInDirectory(songsPath);
        for (const uuid of songs) {
            const songPath = path.join(songsPath, uuid);
            if (lstatSync(songPath).isDirectory()) {
                const metadataPath = path.join(songPath, 'metadata.json');
                if (pathExists(metadataPath)) {
                    const metadata = JSON.parse(await readFile(metadataPath));
                    library.push(metadata);
                }
            }
        }
    }
    console.timeEnd('Time to load library');
    return library.sort((a, b) => b.date_added - a.date_added).map((song, index) => ({ ...song, index }));
};

const addObserver = (observer) => {
    observers.push(observer);
};

const removeObserver = (observer) => {
    const index = observers.indexOf(observer);
    if (index > -1) {
        observers.splice(index, 1);
    }
};

const notifyObservers = () => {
    for (let x = 0; x < observers.length; x++) {
        const update = observers[x];
        update({ ...library });
    }
};

const getLibrary = () => {
    return library;
};

async function initialize() {
    await updateLibrary();
    if (library.all.length > 0) {
        await PlayerService.loadPlaylist('library', library.all, 0);
        PlayerService.pause();
    }
}

initialize();

export default { updateLibrary, getLibrary, addObserver, removeObserver, notifyObservers };
