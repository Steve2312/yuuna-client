import React from 'react';

import NavigationButton from "./NavigationButton";

function NavigationButtons(props) {
    function viewHome() {
        switchView(0);
    }

    function viewSearch() {
        switchView(1);
    }

    function viewImport() {
        switchView(2);
    }

    function viewLibrary() {
        switchView(3);
    }

    function viewNewPlaylist() {
        switchView(4);
    }

    function switchView(index) {
        const [view, setView] = props.viewState;
        if (index !== view) {
            setView(index);
          }
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