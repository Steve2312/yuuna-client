import React, {useState, useEffect} from 'react';
import SearchMenu from "./SearchMenu";
import SearchCard from './SearchCard';
import request from 'request';


function Search() {
    
    var fetchTimeout;
    var cards;

    const [results, setResults] = useState();
    

    function getLink(input, category) {
        return encodeURI('https://beatconnect.io/api/search?token='+ process.env.BEATCONNECT_API_KEY + '&s=' + category + '&q=' + input);
    }

    function getResults(input, category) {
        clearTimeout(fetchTimeout);
        fetchTimeout = setTimeout(() => {
            console.log("Timeout ended: " + input + " / " + category);
            request(getLink(input, category), (error, response, body) => {
                setResults(JSON.parse(body));
            })
        }, 1000);
    }

    useEffect(() => {
        if (!results) {
            getResults("", "ranked");
        }
        console.log(results);
    });

    if (results) {
        cards = results.beatmaps.map((beatmap) =>
            <SearchCard key={beatmap.id} beatmap={beatmap} />
        );
    }

    return <>
        <SearchMenu getResults={getResults} />
        {cards}
    </>;
}

export default Search;