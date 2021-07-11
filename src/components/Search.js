import React, {useState, useEffect, useRef} from 'react';
import SearchMenu from "./SearchMenu";
import BeatmapCard from './BeatmapCard';
import SearchHandler from '../helpers/SearchHandler';
import Banner from "./Banner";

function Search() {
    /**
     * Only render beatmapCard if visible
    */
    const [verticalPosition, setVerticalPosition] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);
    const beatmapCardWrapper = useRef();

    const prerenderCount = 7;
    const componentHeight = 90;

    useEffect(() => {
        const view = document.getElementsByClassName("viewWrapper")[0];

        updateViewHeight();
        view.addEventListener("scroll", updateVerticalPosition);
        window.addEventListener("resize", updateViewHeight);

        return() => {
            view.removeEventListener("scroll", updateVerticalPosition);
            window.removeEventListener("resize", updateViewHeight);
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


    /**
     * Search
    */
    const [search, setSearch] = useState(SearchHandler.getResults());
    useEffect(() => {
        const view = document.getElementsByClassName("viewWrapper")[0];
        view.addEventListener("scroll", requestNextPage);

        SearchHandler.addObserver(setSearch);
        SearchHandler.search();

        return () => {
            view.removeEventListener("scroll", requestNextPage);

            SearchHandler.removeObserver(setSearch);
            SearchHandler.clearResults();
        };
    }, []);

    function requestNextPage(event) {
        const {scrollHeight, scrollTop, offsetHeight} = event.target;
        if (scrollHeight - scrollTop - offsetHeight < 4000) {
            SearchHandler.search();
        }
    }

    const lowestBoundaryPixel = verticalPosition - (prerenderCount * componentHeight);
    const highestBoundaryPixel = verticalPosition + viewHeight + (prerenderCount * componentHeight);
    const beatmapCards = search.map((beatmap, index) => {
        const topPosition = index * componentHeight;
        if (topPosition >= lowestBoundaryPixel && topPosition <= highestBoundaryPixel) { 
            return <BeatmapCard style={{top: topPosition}} key={beatmap.id} beatmap={beatmap} index={index}/>
        }
    });

    return <>
        <SearchMenu />
        <div className="beatmapCardWrapper" ref={beatmapCardWrapper} style={{height: search.length * componentHeight}}>
            {beatmapCards}
        </div>
    </>;
}

export default Search;