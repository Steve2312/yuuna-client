import request from "request";

const observers = [];

const search = {
    input: {
        query: "",
        status: "ranked"
    },
    request: {
        timeout: null,
        instance: null,
        error: null
    },
    results: {
        data: [],
        page: 0,
        lastPage: false
    }
}

const find = (userInput, userStatus) => {
    const {request, results} = search;
    const {timeout, instance} = request;
    const {data, lastPage} = results;

    if (userInput !== undefined && userStatus !== undefined) {
        clearTimeout(timeout);
        if (instance) {
            instance.abort();
        }

        search.request.timeout = setTimeout(() => {
            search.input.query = userInput;
            search.input.status = userStatus;
            search.results.page = 0;
            search.results.lastPage = false;

            createRequest((results) => {
                search.results.data = [...results];
                search.request.timeout = null;
                search.results.page++;
                notifyObservers();
            });
        }, 1000);
        notifyObservers();
        return;
    }
    // IF END OF PAGE AND U SWITCH PAGE AND COME BACK, IT DOESNT REQUEST
    if (!instance && !lastPage) {
        createRequest((results) => {
            search.results.data = [...data, ...results];
            search.results.page++;
            notifyObservers();
        });
    }
}

function createRequest(callback) {
    search.request.error = null;
    search.request.instance = request(generateLink(), (error, response, body) => {
        search.request.instance = null;
        if (!error) {
            const results = JSON.parse(body).beatmaps;
            if (results.length < 50) {
                search.results.lastPage = true;
            }

            callback(results);
        }

        if (error) {
            search.request.error = error;
            notifyObservers();
        }
    });
    notifyObservers();
}

function generateLink() {
    return encodeURI('https://beatconnect.io/api/search?token='+ process.env.BEATCONNECT_API_KEY + '&s=' + search.input.status + '&q=' + search.input.query + '&p=' + search.results.page);
}

const getSearch = () => {
    return search;
}

const clearResults = () => {
    const {request} = search;
    const {timeout, instance} = request;

    search.input.query = "";
    search.input.status = "ranked";

    clearTimeout(timeout);
    search.request.timeout = null;
    if (instance) {
        instance.abort();
        search.request.instance = null;
    }
    search.request.error = null;

    search.results.data = [];
    search.results.page = 0;
    search.results.lastPage = false;
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
        update({...search});
    }
}

export default {find, getSearch, clearResults, addObserver, removeObserver, notifyObservers}

