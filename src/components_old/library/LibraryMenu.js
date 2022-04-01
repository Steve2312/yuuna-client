import React from 'react';

function LibraryMenu(props) {
    return (
        <div className="libraryMenu">
            <span>Total songs: <span id="total_songs">{props.library.length}</span></span>
            <input type="text" placeholder="Search" />
        </div>
    );
}

export default LibraryMenu;