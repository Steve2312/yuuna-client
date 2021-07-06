import React, { useContext } from 'react';
import LibraryContext from '../context/LibraryContext';
import LibraryMenu from './LibraryMenu'
import SongCard from './SongCard';

function Library() {
    const [library, setLibrary] = useContext(LibraryContext);

    function getCards() {
        if (library) {
            return library.map((beatmap, index) => (
                <SongCard key={beatmap.id} beatmap={beatmap} index={index} playlist={library}/>
            ));
        }
        return null;
    }

    return <>
        <LibraryMenu />
        {getCards()}
    </>;
}

export default Library;