import path from 'path';
import Electron from 'electron';
import PreviewHandler from './PreviewHandler';

const appData = Electron.remote.app.getAppPath();
const songsPath = path.join(appData, "songs");

const observers = [];

const player = {
    audio: new Audio(),
    playing: false,

    playlist_name: null,
    playlist: null,

    artist: null,
    title: null,
    beatmapset: null,
    id: null,
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

const load = (playlist_name, playlist, index) => {
    // If the same song gets loaded toggle play and pause.
    const {artist, title, beatmapset_id, id, audio} = playlist[index];

    if (id === player.id) {
        console.log("same id");
        togglePlayPause();
        return;
    }
    
    player.audio.src = path.join(songsPath, id, audio);

    player.playlist_name = playlist_name;
    player.playlist = playlist;
    player.artist = artist;
    player.title = title;
    player.beatmapset = beatmapset_id;
    player.id = id;

    play();

    notifyObservers();
}

const play = () => {
    if (PreviewHandler.getPreview().playing) {
        PreviewHandler.pause();
    }
    player.audio.play();
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
    if (time) {
        player.audio.currentTime = time;
    }
    return player.audio.currentTime;
}

const volume = (volume) => {
    if (volume) {
        player.audio.volume = volume;
        PreviewHandler.volume(volume);
    }

    return player.audio.volume;
}

const getPlayer = () => {
    return player;
}

const updatePlayingState = () => {
    player.playing = !player.audio.paused;
    notifyObservers();
}

player.audio.onpause = () => {
    updatePlayingState();
};

player.audio.onplay = () => {
    updatePlayingState();
};

player.audio.onended = () => {
    var index = getIndexOfNextSong(player.id);
    load(player.playlist_name, player.playlist, getIndexOfNextSong(player.id));
    if (index == 0) {
        pause();
    }
};

function getIndexOfNextSong(id) {
    for (let x = 0; x < player.playlist.length; x++) {
        const song = player.playlist[x];
        if(song.id == id) {
            return (x + 1) % player.playlist.length;
        }
    }
}

export default {load, play, pause, togglePlayPause, seek, volume, addObserver, removeObserver, getPlayer}