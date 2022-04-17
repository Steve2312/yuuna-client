import {shell} from "electron";

export const openBeatmapPage = async (beatmapSetId: number) => {
    const beatmapURL = 'https://osu.ppy.sh/users/' + beatmapSetId;
    await shell.openExternal(beatmapURL);
}

export const openCreatorPage = async (creator: number | string) => {
    const creatorURL = 'https://osu.ppy.sh/users/' + creator;
    await shell.openExternal(creatorURL);
}