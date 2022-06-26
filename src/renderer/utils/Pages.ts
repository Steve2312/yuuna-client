import { shell } from 'electron';

export const openBeatmapPage = async (beatmapSetId: number): Promise<void> => {
    const beatmapURL = 'https://osu.ppy.sh/beatmapsets/' + beatmapSetId;
    await shell.openExternal(beatmapURL);
};

export const openCreatorPage = async (creator: number | string): Promise<void> => {
    const creatorURL = 'https://osu.ppy.sh/users/' + creator;
    await shell.openExternal(creatorURL);
};