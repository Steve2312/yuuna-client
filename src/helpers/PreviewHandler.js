import PlayerHandler from "./PlayerHandler";

const observers = [];

const preview = {
    audio: new Audio(),
    playing: false,
    id: null,
}

preview.audio.autoplay = true;

const playPreview = (id) => {
    if (PlayerHandler.getPlayer().playing) {
        PlayerHandler.pause();
    }

    if (id == preview.id) {
        preview.audio.paused ? preview.audio.play() : preview.audio.pause();
        return;
    }
    preview.audio.src = `https://b.ppy.sh/preview/${id}.mp3`;
    preview.id = id;
    notifyObservers();
}

const getPreview = () => {
    return preview;
}

const updatePlayingState = () => {
    preview.playing = !preview.audio.paused;
    notifyObservers();
}

const pause = () => {
    preview.audio.pause();
}

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
        update({...preview});
    }
}

export default {playPreview, getPreview, pause, addObserver, removeObserver}