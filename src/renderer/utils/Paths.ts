import {ipcRenderer} from "electron";
import * as path from "path";
import Song from "@/types/Song";
import Beatmap from "@/types/Beatmap";

export const appDataPath = ipcRenderer.sendSync("appData-path");
export const songsPath = path.join(appDataPath, "songs");
export const tempPath = path.join(appDataPath, "temp");

export const getCoverPath = (song: Song) => {
    return "file://" + path.join(songsPath, song.id, "cover.jpg");
};

export const getHeaderPath = (song: Song) => {
    return "file://" + path.join(songsPath, song.id, "header.jpg");
};

export const getSongPath = (song: Song) => {
    return "file://" + path.join(songsPath, song.id, song.audio);
};

export const getTempOutputPath = (beatmap: Beatmap) => {
    return path.join(tempPath, beatmap.id + ".zip");
};