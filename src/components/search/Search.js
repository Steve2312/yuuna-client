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
        if (scrollHeight - scrollTop - offsetHeight < 3000 && !search.results.lastPage) {
            SearchHandler.find();
        }
    }

    const lowestBoundaryPixel = verticalPosition - (prerenderCount * componentHeight);
    const highestBoundaryPixel = verticalPosition + viewHeight + (prerenderCount * componentHeight);
    const beatmapCards = search.results.data.map((beatmap, index) => {
        const topPosition = index * componentHeight;
        if (topPosition >= lowestBoundaryPixel && topPosition <= highestBoundaryPixel) { 
            return <SearchCard style={{top: topPosition}} key={beatmap.id} beatmap={beatmap} index={index}/>
        }
    });

    const getEndPageMessage = () => {
        if (search.request.error != null) {
            if (search.request.error.code === 'ETIMEDOUT') {
                return "Connect timeout with the server (╥_╥) \n You're either offline or the Beatconnect server are unavaliable at the moment.";
            }

            if (search.request.error.code === 'EAI_AGAIN') {
                return "DNS lookup timed out (╥_╥) \n You're either offline or the Beatconnect server are unavaliable at the moment.";
            }

            return "An error has occured with code: " + search.request.error.code + "\n You're either offline or the Beatconnect server are unavaliable at the moment.";
        }
        
        if (search.results.lastPage && search.results.data.length > 0) {
            return "No more results...(╥_╥)";
        }

        if (search.request.instance != null) {
            return "Searching...(´｡• ᵕ •｡`)"
        }

        if (search.results.lastPage && search.results.data.length == 0) {
            return "No results...( ; ω ; )"
        }

        return "";
    }

    const beatmapCardWrapperClass = search.request.timeout != null ? "beatmapCardWrapper searchingOverlay" : "beatmapCardWrapper";
    const lastPageClass = search.request.instance != null ? "lastPage searchingOverlay" : "lastPage";
    return <>
        <SearchMenu />
        <div className={beatmapCardWrapperClass} ref={searchCardWrapper} style={{height: search.results.data.length * componentHeight}}>
            {beatmapCards}
        </div>
        <span className={lastPageClass}>{getEndPageMessage()}</span>
    </>;
}

export default Search;