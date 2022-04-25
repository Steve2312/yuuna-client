interface Beatmap {
    id: number,
    title: string,
    artist: string,
    source: string,
    creator: string,
    average_length: number,
    bpm: number,
    unique_id: string
}

export default Beatmap;