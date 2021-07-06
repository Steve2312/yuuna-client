import React, {useState, useEffect, useContext} from 'react';
import SearchMenu from "./SearchMenu";
import request from 'request';
import BeatmapCard from './BeatmapCard';

function Search() {
    const [results, setResults] = useState();

    var fetchTimeout;
    var fetchRequest;

    function getLink(input, category) {
        return encodeURI('https://beatconnect.io/api/search?token='+ process.env.BEATCONNECT_API_KEY + '&s=' + category + '&q=' + input);
    }

    function getResults(input, category) {
        clearTimeout(fetchTimeout);
        fetchTimeout = setTimeout(() => {
            console.log("Timeout ended: " + input + " / " + category);
            fetchRequest = request(getLink(input, category), (error, response, body) => {
                setResults(JSON.parse(body));
            })
        }, 1000);
    }

    useEffect(() => {
        if (!results) {
            getResults("", "ranked");
        }
        console.log(results)
        return (() => {
            clearTimeout(fetchTimeout);
            if (fetchRequest) fetchRequest.abort();
        })
    }, [results]);

    function getCards() {
        if (results) {
            return results.beatmaps.map((beatmap, index) =>
                <BeatmapCard key={beatmap.id} beatmap={beatmap} index={index}/>
            );
        }
    }

    return <>
        <SearchMenu getResults={getResults} />
        {getCards()}
    </>;
}

export default Search;