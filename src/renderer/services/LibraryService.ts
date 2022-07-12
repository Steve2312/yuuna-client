import Observable from '@/services/Observable';
import Song from '@/types/Song';
import * as path from 'path';
import * as fs from 'fs';
import extract from 'extract-zip';
import SongMetadata from '@/types/SongMetadata';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import { songsPath } from '@/utils/Paths';

export type LibraryServiceStateProps = {
    songs: Song[]
}

class LibraryService extends Observable<LibraryServiceStateProps> {

    private songs: Song[] = [];

    constructor() {
        super();
        this.loadLibrary();
    }

    public import = async (path: string): Promise<void> => {
        const outputPath = await this.unzipFile(path);
        const osuFiles = await this.findOsuFiles(outputPath);
        const songs: SongMetadata[] = await this.parseOsuFiles(osuFiles);

        for await (const songMetadata of songs) {
            await this.importToLibrary(songMetadata, outputPath);
        }

        await this.deleteFile(path);
        await this.deleteDirectory(outputPath);
        await this.loadLibrary();
    };

    private importToLibrary = async (songMetadata: SongMetadata, outputPath: string): Promise<void> => {
        const basePath = path.join(songsPath, songMetadata.id);
        const audioSourcePath = path.join(outputPath, songMetadata.audio);
        const audioDestinationPath = path.join(basePath, songMetadata.audio);

        const coverURL = `https://assets.ppy.sh/beatmaps/${songMetadata.beatmapset_id}/covers/list@2x.jpg`;
        const headerURL = `https://assets.ppy.sh/beatmaps/${songMetadata.beatmapset_id}/covers/card@2x.jpg`;

        await this.createDirectory(basePath);
        await this.downloadImage(coverURL, path.join(basePath, 'cover.jpg'));
        await this.downloadImage(headerURL, path.join(basePath, 'header.jpg'));
        await this.copyFile(audioSourcePath, audioDestinationPath);
        await this.writeSongMetadata(songMetadata, basePath);
    };

    private loadLibrary = async (): Promise<void> => {
        this.getSongs().then(songs => {
            this.songs = songs;
            this.notify(this.getState());
        });
    };

    private getSongs = async (): Promise<Song[]> => {
        const songIdentifiers = await this.fetchSongIdentifiers();

        const songs: Song[] = [];

        for (const id of songIdentifiers) {
            try {
                const metadataPath = path.join(songsPath, id, 'metadata.json');
                const metadata = JSON.parse(await this.readFile(metadataPath));
                songs.push(metadata);
            } catch (error) {
                console.error('Failed to load song with id: ' + id);
            }
        }

        return this.sortSongsByDateAdded(songs).map((song, index) => ({ ...song, index }));
    };

    private fetchSongIdentifiers = async (): Promise<string[]> => {
        const directoryEntities = await fs.promises.readdir(songsPath, { withFileTypes: true });
        return directoryEntities.filter(directoryEntity => {
            return directoryEntity.isDirectory();
        }).map(directoryEntity => {
            return directoryEntity.name;
        });
    };

    private readFile = (src: string): Promise<string> => {
        return fs.promises.readFile(src, 'utf-8');
    };

    private unzipFile = async (src: string): Promise<string> => {
        const outputPath = src.replace('.zip', '');

        await extract(src, {
            dir: outputPath
        });

        return outputPath;
    };

    private findOsuFiles = async (src: string): Promise<string[]> => {
        const files = await fs.promises.readdir(src);

        return files.filter(file => path.extname(file) == '.osu').map(file => path.join(src, file));
    };

    private parseOsuFiles = async (osuFiles: string[]): Promise<SongMetadata[]> => {
        const audioFiles = new Set<string>();
        const songs: SongMetadata[] = [];

        for await (const osuFile of osuFiles) {
            const osuFileData = await this.parseOsuFile(osuFile);

            if (!audioFiles.has(osuFileData.audio)) {
                audioFiles.add(osuFileData.audio);
                songs.push(osuFileData);
            }
        }

        return songs;
    };

    private parseOsuFile = async (src: string): Promise<SongMetadata> => {
        const osuFileContent: string = await this.readFile(src);
        const songMetadata: SongMetadata = this.getEmptySongMetadata();

        const beatLengths: number[] = [];
        let capturingTimingPoints = false;

        for (const line of osuFileContent.split(/\r?\n/)) {
            const [key, ...rest] = line.split(':');
            const value = rest.join(':').trim();

            if (key == 'AudioFilename') songMetadata.audio = value;
            else if (key == 'Artist') songMetadata.artist = value;
            else if (key == 'Title') songMetadata.title = value;
            else if (key == 'Version') songMetadata.version = value;
            else if (key == 'Source') songMetadata.source = value;
            else if (key == 'Creator') songMetadata.creator = value;
            else if (key == 'BeatmapSetID') songMetadata.beatmapset_id = parseInt(value);
            else if (key == '[TimingPoints]') capturingTimingPoints = true;
            else if (capturingTimingPoints) {
                if (line != '') {
                    const beatLength = parseFloat(line.split(',')[1]);
                    beatLengths.push(beatLength);
                }
                else break;
            }
        }

        songMetadata.id = uuid();
        songMetadata.date_added = Date.now();
        songMetadata.bpm = this.calculateBPM(beatLengths);
        songMetadata.duration = await this.getAudioDuration('file://' + path.join(src, '../', songMetadata.audio));

        return songMetadata;
    };

    private calculateBPM = (beatLengths: number[]): number => {
        const calculations: number[] = [];

        beatLengths = beatLengths.filter(beatLength => beatLength > 0);

        for (const beatLength of beatLengths) {
            const bpm = Math.round(60000 / beatLength * 100) / 100;
            calculations.push(bpm);
        }

        return Math.max(...calculations);
    };

    private getAudioDuration = (src: string): Promise<number> => {
        return new Promise((resolve, reject) => {
            const audio = document.createElement('audio');

            audio.src = src;
            audio.onloadedmetadata = () => {
                const duration = audio.duration;
                audio.remove();
                resolve(duration);
            };
            audio.onerror = (error: Event | string) => {
                reject(error);
            };
        });
    };

    private deleteDirectory = async (path: string): Promise<void> => {
        return fs.promises.rmdir(path, {
            recursive: true
        });
    };

    private deleteFile = async (path: string): Promise<void> => {
        return fs.promises.rm(path);
    };

    private createDirectory = async (src: string): Promise<void> => {
        return fs.promises.mkdir(src);
    };

    private copyFile = async (src: string, destination: string): Promise<void> => {
        return fs.promises.copyFile(src, destination);
    };

    private writeSongMetadata = async (songMetadata: SongMetadata, folder: string): Promise<void> => {
        return fs.promises.writeFile(path.join(folder, 'metadata.json'), JSON.stringify(songMetadata), { encoding: 'utf-8' });
    };

    private sortSongsByDateAdded = (songs: Song[]): Song[] => {
        return songs.sort((a, b) => {
            return b.date_added - a.date_added;
        });
    };

    private downloadImage = async (src: string, destination: string): Promise<void> => {
        const response = await axios.get(src, {
            responseType: 'arraybuffer'
        });

        return fs.promises.writeFile(destination, Buffer.from(response.data));
    };

    private getEmptySongMetadata = (): SongMetadata => {
        return {
            audio: '',
            artist: '',
            title: '',
            version: '',
            source: '',
            duration: 0,
            creator: '',
            bpm: 0,
            beatmapset_id: 0,
            id: '',
            date_added: 0
        };
    };

    public getState = (): LibraryServiceStateProps => {
        return {
            songs: this.songs
        };
    };
}

export default new LibraryService();