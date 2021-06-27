import React, {useContext} from 'react';
import {shell} from 'electron';
import {formatSeconds} from '../utils/utils';
import PreviewContext from '../context/PreviewContext';

function SearchCard(props) {
    const [preview, setPreview] = useContext(PreviewContext);
    const {artist, average_length, title, id, source} = props.beatmap;
    const cover = {
        backgroundImage: `url("https://b.ppy.sh/thumb/${id}l.jpg"), url("https://steamuserimages-a.akamaihd.net/ugc/848216173214789511/C2CB4C35AE9386EB78FF5F34FFEBB69DD587E7F0/`
    }

    function openURL() {
        shell.openExternal(`https://osu.ppy.sh/beatmapsets/${id}`);
    }

    function previewAudio() {
        props.previewAudio(id);
    }

    console.log("oof")

    const playButtonClass = preview.id === id && preview.playing ? "fas fa-pause" : "fas fa-play";
    const searchCardClass = preview.id === id ? "searchCard searchCardPlaying" : "searchCard";

    return (
        <div className={searchCardClass}>
            <div className="cover" style={cover}>
                <p className="playButton">
                    <span onClick={previewAudio}>
                        <i className={playButtonClass}></i>
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