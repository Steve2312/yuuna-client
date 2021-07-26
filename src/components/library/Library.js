import React, { useState, useEffect, useContext, useRef } from 'react';
import LibraryMenu from './LibraryMenu'
import LibraryCard from './LibraryCard';
import LibraryHandler from '../../helpers/LibraryHandler';

function Library() {
    const [library, setLibrary] = useState(LibraryHandler.getLibrary());
    /**
     * Only render beatmapCard if visible
     */
    const [verticalPosition, setVerticalPosition] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);
    const beatmapCardWrapper = useRef();

    const prerenderCount = 7;
    const componentHeight = 90;

    useEffect(() => {
        LibraryHandler.addObserver(setLibrary);
        const view = document.getElementsByClassName("viewWrapper")[0];

        updateViewHeight();
        view.addEventListener("scroll", updateVerticalPosition);
        window.addEventListener("resize", updateViewHeight);

        return() => {
            view.removeEventListener("scroll", updateVerticalPosition);
            window.removeEventListener("resize", updateViewHeight);
            LibraryHandler.removeObserver(setLibrary);
        }
    }, []);

    function updateViewHeight() {
        const {clientHeight} = document.getElementsByClassName("viewWrapper")[0];
        setViewHeight(clientHeight);
    }

    function updateVerticalPosition(event) {
        if (beatmapCardWrapper.current != null) {
            const {offsetTop} = beatmapCardWrapper.current;
            const {scrollTop} = event.target;
            setVerticalPosition(scrollTop - offsetTop);
        }
    }

    const lowestBoundaryPixel = verticalPosition - (prerenderCount * componentHeight);
    const highestBoundaryPixel = verticalPosition + viewHeight + (prerenderCount * componentHeight);
    const beatmapCards = library.all.map((beatmap, index) => {
        const topPosition = index * componentHeight;
        if (topPosition >= lowestBoundaryPixel && topPosition <= highestBoundaryPixel) { 
            return <LibraryCard style={{top: topPosition}} key={beatmap.id} beatmap={beatmap} index={index} playlist={library.all}/>
        }
    });

    return <>
        <LibraryMenu library={library.all}/>
        <div className="beatmapCardWrapper" ref={beatmapCardWrapper} style={{height: library.all.length * componentHeight}}>
            {beatmapCards}
        </div>
        
    </>;
}

export default Library;