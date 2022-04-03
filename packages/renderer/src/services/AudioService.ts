class AudioService {
    /**
     * Return Audio Object when the source is able to play without having to load
     * @param src 
     * @param volume 
     * @returns 
     */
    public create = (src: string, volume: number): Promise<HTMLAudioElement> => {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            
            audio.volume = volume;

            audio.addEventListener("canplay", () => {
                resolve(audio);
            }, {
                once: true
            });

            audio.addEventListener("error", (error: ErrorEvent) => {
                reject(error);
            }, {
                once: true
            });

            audio.src = src;
        });
    }
}

export default new AudioService();