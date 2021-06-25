import React, {createRef} from 'react';
import {shell} from 'electron';
import {formatSeconds} from '../utils/utils';

function SearchCard(props) {
    const searchCard = createRef();
    const playButton = createRef();
    const {artist, average_length, title, id, source} = props.beatmap;

    const cover = {
        backgroundImage: `url("https://b.ppy.sh/thumb/${id}l.jpg"), url("https://steamuserimages-a.akamaihd.net/ugc/848216173214789511/C2CB4C35AE9386EB78FF5F34FFEBB69DD587E7F0/`
    }

    function openURL() {
        shell.openExternal(`https://osu.ppy.sh/beatmapsets/${id}`);
    }

    function previewAudio() {
        var classListPlayButton = playButton.current.classList;
        var classListsearchCard = searchCard.current.classList;

        if (classListPlayButton.contains("fa-pause")) {
            classListPlayButton.add("fa-play");
            classListPlayButton.remove("fa-pause");

            classListsearchCard.remove("searchCardPlaying");
        } else {
            classListPlayButton.add("fa-pause");
            classListPlayButton.remove("fa-play");

            classListsearchCard.add("searchCardPlaying");
        }
    }

    return (
        <div className="searchCard" ref={searchCard}>
            <div className="cover" style={cover}>
                <p className="playButton">
                    <span onClick={previewAudio}>
                        <i ref={playButton} className="fas fa-play"></i>
                    </span>
                </p>
            </div>

            <div className="metadataWrapper">

                <div className="metadata">
                    <div>
                        <p className="title">TITLE</p>
                        <p className="value">{title}</p>
                    </div>
                </div>

                <div className="metadata">
                    <div>
                        <p className="title">ARTIST</p>
                        <p className="value">{artist}</p>
                    </div>
                </div>

                <div className="metadata">
                    <div>
                        <p className="title">DURATION</p>
                        <p className="value">{formatSeconds(average_length)}</p>
                    </div>
                </div>

                <div className="metadata">
                    <div>
                        <p className="title">SOURCE</p>
                        <p className="value">{source ? source : "-"}</p>
                    </div>
                </div>

                <div className="metadata">
                    <div>
                        <p className="title">BEATMAP ID</p>
                        <p className="value beatmapValue" onClick={openURL}>{id}</p>
                    </div>
                </div>
            </div>

            <div className="options">
                <span><i className="fas fa-download"></i></span>
                <span><i className="fas fa-ellipsis-h"></i></span>
            </div>
        </div>
    );
}

export default SearchCard;