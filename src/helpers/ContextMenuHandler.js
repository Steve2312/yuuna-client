const observers = [];

const data = {
    buttons: [],
    top: null,
    left: null
}

const showContext = function(event, buttons) {
    clear();
    data.buttons = buttons;
    data.top = event.clientY;
    data.left = event.clientX;
    notifyObservers();
}

const clear = function(event, beatmap) {
    data.buttons = [];
    data.top = null;
    data.left = null;
    notifyObservers();
    console.log("Cleared context")
}

const getData = function() {
    return data;
}

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
        update({...data});
    }
}

export default {showContext, addObserver, removeObserver, clear, getData}