import React from 'react';

function LibraryMenu() {
    return (
        <div className="libraryMenu">
            <span>Total songs: <span id="total_songs">0</span></span>
            <input type="text" placeholder="Search" />
        </div>
    );
}

export default LibraryMenu;