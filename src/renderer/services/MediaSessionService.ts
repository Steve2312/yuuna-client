import thumbnail from "../assets/images/no_thumbnail.jpg";

class MediaSessionService {

    private mediaSession = navigator?.mediaSession || null;

    public display = async (title: string, artist: string, coverPath: string) => {

        const dataURL = await this.imageToDataURL(coverPath);

        if (this.mediaSession) {
            const metadata = new MediaMetadata({
                title: title,
                artist: artist,
                artwork: [
                    {
                        src: dataURL,
                        sizes: "512x512",
                        type: "image/jpeg"
                    }
                ]
            });
            
            this.mediaSession.metadata = metadata;
        }

    };

    public setPlaybackState = (state: "paused" | "playing") => {
        if (this.mediaSession) {
            this.mediaSession.playbackState = state;
        }
    };

    public getMediaSession = (): MediaSession => {
        return this.mediaSession;
    };

    private imageToDataURL = async (path: string): Promise<string> => {
        try {
            const data = await fetch(path);
            const blob = await data.blob();
            return URL.createObjectURL(blob);
        } catch {
            const data = await fetch(thumbnail);
            const blob = await data.blob();
            return URL.createObjectURL(blob);
        }
    };
}

export default new MediaSessionService();