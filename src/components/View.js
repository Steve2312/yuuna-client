import React from 'react';

import Banner from "./Banner";
import Search from "./search/Search";
import Library from './library/Library';

function View(props) {
    const HOME = 0;
    const SEARCH = 1;
    const IMPORT = 2;
    const LIBRARY = 3;

    if (props.index === HOME) {
        return <>
            <Banner key={HOME} title="Home" banner="home"></Banner>
        </>
    }

    if (props.index === SEARCH) {
        return <>
            <Banner key={SEARCH} title="Download Songs" banner="search"></Banner>
            <Search />
        </>
    }

    if (props.index === IMPORT) {
        return <>
            <Banner key={IMPORT} title="Import beatmap" banner="import"></Banner>
        </>
    }

    if (props.index === LIBRARY) {
        return <>
            <Banner key={LIBRARY} title="Library" banner="library"></Banner>
            <Library />
        </>
    }

    return null;
}

export default View;