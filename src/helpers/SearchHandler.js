import request from "request";

const observers = [];

var results = [];
var page = -1;
var endOfPage = false;

var searchInput = "";
var searchCategory = "ranked";

var timeout = null;
var fetchRequest = null;

const search = (input, category) => {
    if (input !== undefined && category !== undefined) {
        searchInput = input;
        searchCategory = category;
        page = 0;
        endOfPage = false;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fetchRequest = request(getLink(), (error, response, body) => {
                fetchRequest = null;
                if (JSON.parse(body).beatmaps.length == 0) {
                    endOfPage = true;
                    console.log("end of page");
                }
                results = [...JSON.parse(body).beatmaps];
                notifyObservers();
            });
        }, 1000);
        return;
    }
    // IF END OF PAGE AND U SWITCH PAGE AND COME BACK, IT DOESNT REQUEST
    if (!fetchRequest && !endOfPage) {
        page++;
        console.log(page)
        fetchRequest = request(getLink(), (error, response, body) => {
            fetchRequest = null;
            if (JSON.parse(body).beatmaps.length == 0) {
                endOfPage = true;
                console.log("end of page");
            }
            results = [...results, ...JSON.parse(body).beatmaps];
            notifyObservers();
        });
    }
}

function getLink() {
    return encodeURI('https://beatconnect.io/api/search?token='+ process.env.BEATCONNECT_API_KEY + '&s=' + searchCategory + '&q=' + searchInput + '&p=' + page);
}

const getResults = () => {
    return results;
}

const clearResults = () => {
    results = [];
    page = -1;
    endOfPage = false;
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
        update([...results]);
    }
}

export default {search, getResults, clearResults, addObserver, removeObserver, notifyObservers}

