import React, {useEffect, useRef, useState} from "react";
import Banner from "@/components/Banner";
import SearchBanner from "../assets/banners/search.png"
import SearchMenu from "@/components/SearchMenu";
import useSearchService from "@/hooks/useSearchService";
import SearchCard from "@/components/SearchCard";
import styles from "@/styles/search.module.scss";
import SearchService from "@/services/SearchService";
import List from "@/components/List";

const Search: React.FC = () => {

    const listRef = useRef<HTMLDivElement>(null);
    const [search] = useSearchService();

    useEffect(() => {
        SearchService.search('', 'ranked');
    }, [])

    // const backToTop = () => {
    //     const listElement = listRef.current;
    //     if (listElement) listElement.scrollTo({
    //         top: 0,
    //         behavior: 'smooth'
    //     })
    // }

    return (
        <List
            ref={listRef}
            header={
                () => {
                    return (
                        <>
                            <Banner title="Search" src={SearchBanner} scrollableElementRef={listRef}/>
                            <SearchMenu />
                        </>
                    )
                }
            }
            data={search.results.beatmaps}

            keyExtractor={data => data.id}

            render={
                ({data, index}) => {
                    return (
                        <SearchCard beatmap={data} index={index}/>
                    )
                }
            }

            prerenderCount={7}
            componentHeight={90}
            onEndReached={() => {
                if (!search.results.lastPage) {
                    SearchService.searchNext();
                }
            }}
            thresholdEnd={3000}
        />
    );
}

export default Search;