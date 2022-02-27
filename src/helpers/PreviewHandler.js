import PlayerService from '../services/PlayerService';

const observers = [];

const preview = {
    audio: new Audio(),
    playing: false,
    id: null,
};

preview.audio.autoplay = true;
preview.audio.volume = 0.24;

const playPreview = (id) => {
    if (PlayerService.getState().playing) {
        PlayerService.pause();
    }

    if (id == preview.id) {
        preview.audio.paused ? preview.audio.play() : preview.audio.pause();
        return;
    }
    preview.audio.src = `https://b.ppy.sh/preview/${id}.mp3`;
    preview.id = id;
    notifyObservers();
};

const volume = (volume) => {
    if (volume) {
        preview.audio.volume = volume;
    }

    return preview.audio.volume;
};

const getPreview = () => {
    return preview;
};

const updatePlayingState = () => {
    preview.playing = !preview.audio.paused;
    notifyObservers();
};

const pause = () => {
    preview.audio.pause();
};

preview.audio.onpause = () => {
    updatePlayingState();
};

preview.audio.onplay = () => {
    updatePlayingState();
};

preview.audio.onended = () => {
    preview.id = null;
    notifyObservers();
};

const addObserver = (observer) => {
    observers.push(observer);
};

const removeObserver = (observer) => {
    const index = observers.indexOf(observer);
    if (index > -1) {
        observers.splice(index, 1);
    }
};

const notifyObservers = () => {
    for (let x = 0; x < observers.length; x++) {
        const update = observers[x];
        update({ ...preview });
    }
};

export default { playPreview, getPreview, pause, volume, addObserver, removeObserver };
