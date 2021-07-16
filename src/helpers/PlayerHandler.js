import path from 'path';
import Electron from 'electron';
import PreviewHandler from './PreviewHandler';

const appData = Electron.remote.app.getAppPath();
const songsPath = path.join(appData, "songs");

const observers = [];

const player = {
    audio: new Audio(),
    playing: false,
    shuffle: false,
    muted: false,

    playlist_name: null,
    playlist: null,

    artist: null,
    title: null,
    beatmapset: null,
    id: null
}

player.audio.volume = 0.24;

const addObserver = (observer) => {
    observers.push(observer);
}

const removeObserver = (observer) => {
    const index = observers.indexOf(observer);
    if (index > -1) {
        observers.splice(index, 1);
    }
}

const notifyObservers = () => {
    for (let x = 0; x < observers.length; x++) {
        const update = observers[x];
        update({...player});
    }
}

const loadFromPlaylist = async (playlist_name, playlist, index) => {
    const {artist, title, beatmapset_id, id, audio} = playlist[index];
    // If the same song gets loaded toggle play and pause.
    if (id === player.id) {
        togglePlayPause();
        return;
    }
    
    player.audio = await getAudio(path.join(songsPath, id, audio));
    player.playlist_name = playlist_name;
    player.playlist = playlist;
    player.artist = artist;
    player.title = title;
    player.beatmapset = beatmapset_id;
    player.id = id;

    if (player.shuffle) {
        shuffle();
    }

    play();
    updateMediaSession();
    notifyObservers();
}

var isLoading = false;
const load = async (index) => {
    if (!isLoading) {
        isLoading = true;
        const {artist, title, beatmapset_id, id, audio} = player.playlist[index];

        player.audio = await getAudio(path.join(songsPath, id, audio));
        player.artist = artist;
        player.title = title;
        player.beatmapset = beatmapset_id;
        player.id = id;
    
        updateMediaSession();
        notifyObservers();
        isLoading = false;
    }

}

function getAudio(src) {
    const audio = new Audio(src);
    audio.volume = volume();

    audio.onpause = () => {
        navigator.mediaSession.playbackState = "paused";
        updatePlayingState();
    };
    
    audio.onplay = () => {
        navigator.mediaSession.playbackState = "playing";
        updatePlayingState();
    };
    
    audio.onended = async () => {
        await forward();
        if (getCurrentIndex() == 0) {
            pause();
        }
    };

    return new Promise((resolve, reject) => {
        audio.src = src;
        audio.addEventListener("canplay", () => {
            const oldAudio = player.audio;
            oldAudio.onpause = null;
            oldAudio.pause();
            audio.play();
            resolve(audio);
        }, {once: true});
        /**
         * On error keep forwarding till there is a song that it can play
         */
        audio.addEventListener("error", () => {
            console.log("Error loading the song");
            resolve(player.audio);
        }, {once: true});
    });
}

const play = async () => {
    if (PreviewHandler.getPreview().playing) {
        PreviewHandler.pause();
    }
    await player.audio.play();
}

const pause = () => {
    player.audio.pause();
}

const togglePlayPause = () => {
    if (player.audio.src) {
        player.audio.paused ? play() : pause();
    }
}

const seek = (time) => {
    if (time !== undefined) {
        player.audio.currentTime = time;
    }
    return player.audio.currentTime;
}

const volume = (volume) => {
    if (volume !== undefined) {
        player.audio.volume = volume;
        PreviewHandler.volume(volume);

        if (player.muted) {
            player.muted = false;
        }

        if (volume == 0) {
            player.muted = true;
        }

        notifyObservers();
    }

    return player.audio.volume;
}

const getPlayer = () => {
    return player;
}

const forward = async function () {
    var index = getIndexOfNextSong();
    await load(index);
}

const reverse = function () {
    if (player.audio.currentTime < 0.5) {
        var index = getIndexOfPreviousSong();
        load(index);
        return;
    }

    seek(0);
}

const updatePlayingState = () => {
    player.playing = !player.audio.paused;
    notifyObservers();
}

function getIndexOfNextSong() {
    return (getCurrentIndex() + 1) % player.playlist.length;
}

function getIndexOfPreviousSong() {
    const previousIndex = getCurrentIndex() - 1;
    return previousIndex == -1 ? player.playlist.length + previousIndex : previousIndex;
}

function getCurrentIndex() {
    for (let x = 0; x < player.playlist.length; x++) {
        const song = player.playlist[x];
        if(song.id == player.id) {
            return x;
        }
    }
}

const toggleShuffle = () => {
    player.shuffle ? unshuffle() : shuffle();
    notifyObservers();
}

function shuffle() {
    const currentIndex = getCurrentIndex();
    const shuffled_playlist = player.playlist.filter((song) => song.index != currentIndex).sort(() => Math.random() - 0.5);
    const currentPlaying = player.playlist[currentIndex];
    shuffled_playlist.unshift(currentPlaying);
    player.playlist = shuffled_playlist;
    player.shuffle = true;
    console.log(player.playlist);
}

function unshuffle() {
    player.playlist = player.playlist.sort((a, b) => {
        return a.index - b.index;
    });
    player.shuffle = false;

    console.log(player.playlist);
}

async function updateMediaSession() {
    const {title, artist, id} = player;
    const coverPath = path.join(songsPath, id, "cover.jpg");
    const coverBlob = URL.createObjectURL(await (await fetch(coverPath)).blob());
    if ("mediaSession" in navigator) {
        const mediaMetadata = new MediaMetadata({
            title,
            artist,
            artwork: [{src: coverBlob, sizes: '512x512', type: 'image/jpeg'}]
        });

        navigator.mediaSession.metadata = mediaMetadata;
    }
}

var volumeBeforeMute = volume();
const mute = (mute) => {
    if (mute) {
        volumeBeforeMute = volume();
        volume(0);
        player.muted = true;
    } else {
        volume(volumeBeforeMute);
        player.muted = false;
    }
    notifyObservers();
}

const toggleMute = () => {
    mute(!player.muted);
}

navigator.mediaSession.setActionHandler("previoustrack", reverse);
navigator.mediaSession.setActionHandler("nexttrack", forward);
navigator.mediaSession.setActionHandler("play", play);
navigator.mediaSession.setActionHandler("pause", pause);


export default {toggleMute, mute, load, loadFromPlaylist, play, pause, forward, reverse, toggleShuffle, togglePlayPause, seek, volume, addObserver, removeObserver, getPlayer}