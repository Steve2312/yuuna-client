import React, {useState, useEffect, useRef} from 'react';
import SearchMenu from "./SearchMenu";
import SearchCard from './SearchCard';
import SearchHandler from '../../helpers/SearchHandler';

function Search() {
    /**
     * Only render SearchCard if visible
    */
    const [verticalPosition, setVerticalPosition] = useState(0);
    const [viewHeight, setViewHeight] = useState(0);
    const searchCardWrapper = useRef();

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
        if (searchCardWrapper.current != null) {
            const {offsetTop} = searchCardWrapper.current;
            const {scrollTop} = event.target;
            setVerticalPosition(scrollTop - offsetTop);
        }
    }


    /**
     * Search
    */
    const [search, setSearch] = useState(SearchHandler.getSearch());
    useEffect(() => {
        const view = document.getElementsByClassName("viewWrapper")[0];
        view.addEventListener("scroll", requestNextPage);
        SearchHandler.addObserver(setSearch);
        SearchHandler.find();

        return () => {
            view.removeEventListener("scroll", requestNextPage);

            SearchHandler.removeObserver(setSearch);
            SearchHandler.clearResults();
        };
    }, []);

    function requestNextPage(event) {
        const {scrollHeight, scrollTop, offsetHeight} = event.target;
        if (scrollHeight - scrollTop - offsetHeight < 4000 && !search.endOfPage) {
            SearchHandler.find();
        }
    }

    const lowestBoundaryPixel = verticalPosition - (prerenderCount * componentHeight);
    const highestBoundaryPixel = verticalPosition + viewHeight + (prerenderCount * componentHeight);
    const beatmapCards = search.results.map((beatmap, index) => {
        const topPosition = index * componentHeight;
        if (topPosition >= lowestBoundaryPixel && topPosition <= highestBoundaryPixel) { 
            return <SearchCard style={{top: topPosition}} key={beatmap.id} beatmap={beatmap} index={index}/>
        }
    });

    const getEndPageMessage = () => {
        if (search.endOfPage) {
            if (search.results.length > 0) {
                return "No more results...(╥_╥)";
            }
            return "No results...( ; ω ; )"
        }
        return "";
    }

    return <>
        <SearchMenu />
        <div className="beatmapCardWrapper" ref={searchCardWrapper} style={{height: search.results.length * componentHeight}}>
            {beatmapCards}
        </div>
        <span className="endPage">{getEndPageMessage()}</span>
    </>;
}

export default Search;