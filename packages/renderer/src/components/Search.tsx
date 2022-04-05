import React, {useEffect, useRef } from "react";
import Banner from "@/components/Banner";
import SearchBanner from "../assets/banners/search.png"
import SearchMenu from "@/components/SearchMenu";
import useSearchService from "@/hooks/useSearchService";
import SearchCard from "@/components/SearchCard";
import styles from "@/styles/search.module.scss";
import SearchService from "@/services/SearchService";
import List from "@/components/List";
import TitleBar from "@/components/TitleBar";

const Search: React.FC = () => {

    const listRef = useRef<HTMLDivElement>(null);
    const [search] = useSearchService();

    useEffect(() => {
        SearchService.search('', 'ranked');
    }, [])

    return (
        <>
            <TitleBar title="Search" src={SearchBanner} scrollableElementRef={listRef} />
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
        </>
    );
}

export default Search;