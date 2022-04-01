import React from 'react';

import PlaylistButton from './PlaylistButton';

function PlaylistButtons() {

    const playlists = [
        {name: "Playlist", id: "0"},
        {name: "Playlist", id: "1"},
        {name: "Playlist", id: "2"},
        {name: "Playlist", id: "3"},
        {name: "Playlist", id: "4"},
        {name: "Playlist", id: "5"},
        {name: "Playlist", id: "6"},
        {name: "Playlist", id: "7"},
        {name: "Playlist", id: "8"},
        {name: "Playlist", id: "9"},
        {name: "Playlist", id: "10"},
        {name: "Playlist", id: "11"},
        {name: "Playlist", id: "12"},
        {name: "Playlist", id: "13"},
        {name: "Playlist", id: "14"},
        {name: "Playlist", id: "15"},
        {name: "Playlist", id: "16"},
        {name: "Playlist", id: "17"},
        {name: "Playlist", id: "18"},
        {name: "Playlist", id: "19"},
    ];

    const playlistsButtons = playlists.map(playlist => 
        <PlaylistButton key={playlist.id} name={playlist.name} onClick={() => viewPlaylist(playlist.id)} />
    );

    function viewPlaylist(id) {
        console.log(id);
    }

    return (
        <ul id="playlists">
            {playlistsButtons}
        </ul>
    )
}

export default PlaylistButtons;