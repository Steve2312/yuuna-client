import request from "request";

const observers = [];

const search = {
    results: [],
    page: -1,
    endOfPage: false
}

var searchInput = "";
var searchCategory = "ranked";

var timeout = null;
var fetchRequest = null;

const find = (input, category) => {
    console.log("Find called")
    if (input !== undefined && category !== undefined) {
        searchInput = input;
        searchCategory = category;
        search.page = 0;
        search.endOfPage = false;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fetchRequest = request(getLink(), (error, response, body) => {
                fetchRequest = null;
                if (JSON.parse(body).beatmaps.length < 50) {
                    search.endOfPage = true;
                }
                search.results = [...JSON.parse(body).beatmaps];
                notifyObservers();
            });
        }, 1000);
        return;
    }
    // IF END OF PAGE AND U SWITCH PAGE AND COME BACK, IT DOESNT REQUEST
    if (!fetchRequest && !search.endOfPage) {
        search.page++;
        fetchRequest = request(getLink(), (error, response, body) => {
            fetchRequest = null;
            if (JSON.parse(body).beatmaps.length < 50) {
                search.endOfPage = true;
            }
            search.results = [...search.results, ...JSON.parse(body).beatmaps];
            notifyObservers();
        });
    }
}

function getLink() {
    return encodeURI('https://beatconnect.io/api/search?token='+ process.env.BEATCONNECT_API_KEY + '&s=' + searchCategory + '&q=' + searchInput + '&p=' + search.page);
}

const getSearch = () => {
    return search;
}

const clearResults = () => {
    search.results = [];
    search.page = -1;
    search.endOfPage = false;
    searchInput = "";
    searchCategory = "ranked";
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

