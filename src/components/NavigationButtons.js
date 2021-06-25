import React from 'react';

import NavigationButton from "./NavigationButton";

function NavigationButtons(props) {
    function viewHome() {
        props.switchView(0);
    }

    function viewSearch() {
        props.switchView(1);
    }

    function viewImport() {
        props.switchView(2);
    }

    function viewLibrary() {
        props.switchView(3);
    }

    function viewNewPlaylist() {
        props.switchView(4);
    }

    return (
        <ul>
            <NavigationButton name="Home" icon="home" onClick={viewHome} />
            <NavigationButton name="Download songs" icon="download" onClick={viewSearch} />
            <NavigationButton name="Import beatmap" icon="file-import" onClick={viewImport} />
            <NavigationButton name="Library" icon="bookmark" onClick={viewLibrary} />
            <li />
            <NavigationButton name="New playlist" icon="plus" onClick={viewNewPlaylist} />
            <li><br></br></li>
        </ul>
    )
}

export default NavigationButtons;