import Observable from "@/services/Observable";
import Song from "@/types/Song";
import * as path from "path";
import * as fs from "fs";
import {songsPath} from "@/utils/Paths";

class LibraryService extends Observable{

    private songs: Song[] = [];

    constructor() {
        super();

        this.loadSongs().then(songs => {
            this.songs = songs;
            this.notify(this.getState());
        });
    }

    private loadSongs = async () => {
        const songIdentifiers = await this.fetchSongIdentifiers();

        const songs: Song[] = [];

        for (const id of songIdentifiers) {
            try {
                const metadataPath = path.join(songsPath, id, "metadata.json");
                const metadata = JSON.parse(await this.readFile(metadataPath));
                songs.push(metadata);
            } catch (error) {
                console.error("Failed to load song with id: " + id);
            }
        }

        return this.sortSongsByDateAdded(songs).map((song, index) => ({...song, index}));
    };

    private fetchSongIdentifiers = async () => {
        const directoryEntities = await fs.promises.readdir(songsPath, { withFileTypes: true });
        return directoryEntities.filter(directoryEntity => {
            return directoryEntity.isDirectory();
        }).map(directoryEntity => {
            return directoryEntity.name;
        });
    };

    private readFile = (src: string) => {
        return fs.promises.readFile(src, "utf-8");
    };

    private sortSongsByDateAdded = (songs: Song[]) => {
        return songs.sort((a, b) => {
            return b.date_added - a.date_added;
        });
    };

    public getState = () => {
        return {
            songs: this.songs
        };
    };
}

export default new LibraryService();