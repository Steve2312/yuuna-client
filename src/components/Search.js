import React, {useState, useEffect, useContext} from 'react';
import SearchMenu from "./SearchMenu";
import SearchCard from './SearchCard';
import request from 'request';
import PreviewContext from '../context/PreviewContext';
import PlayerContext from '../context/PlayerContext';


function Search() {
    const [results, setResults] = useState();
    const [preview, setPreview] = useContext(PreviewContext);
    const [player, setPlayer] = useContext(PlayerContext);

    var fetchTimeout;
    var cards;

    // Audio Player settings
    preview.audio.volume = player.volume;
    preview.audio.autoplay = true;

    function previewAudio(id) {
        pausePlayerAudio();
        if (id === preview.id) {
            preview.audio.paused ? preview.audio.play() : preview.audio.pause();
        } else {
            preview.audio.src = `https://b.ppy.sh/preview/${id}.mp3`;
            setPreview(data => ({...data, id: id}));
        }
    }

    function pausePlayerAudio() {
        // If there is a player playing pause it.
        if (!player.audio.paused) {
            player.audio.pause();
        }
    }

    // When audio gets paused from unknown resource
    function updatePlayingState() {
        setPreview(data => ({...data, playing: !preview.audio.paused}));
    }

    preview.audio.onpause = () => {
        updatePlayingState();
    };

    preview.audio.onplay = () => {
        updatePlayingState();
    };

    preview.audio.onended = () => {
        setPreview(data => ({...data, id: null}));
    }

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
            <SearchCard key={beatmap.id} beatmap={beatmap} previewAudio={previewAudio}/>
        );
    }

    return <>
        <SearchMenu getResults={getResults} />
        {cards}
    </>;
}

export default Search;