import { ipcRenderer } from "electron";
import * as path from "path";
import Song from "@/interfaces/Song";
import * as fs from "fs";
import fileExists from "@/utils/FileExists";

export const appDataPath = ipcRenderer.sendSync("appData-path");
export const songsPath = path.join(appDataPath, "songs");
export const tempPath = path.join(appDataPath, "temp");

export const getCoverPath = async (song: Song) => {
    const coverPath = path.join(songsPath, song.id, "cover.jpg");
    return await fileExists(coverPath) ? coverPath : null;
}
export const getHeaderPath = async (song: Song) => {
    const headerPath =  path.join(songsPath, song.id, "header.jpg");
    return await fileExists(headerPath) ? headerPath : null;
}