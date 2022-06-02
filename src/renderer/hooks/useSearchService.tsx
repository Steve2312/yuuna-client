import {useEffect, useState} from "react";
import SearchService from "@/services/SearchService";

const useSearchService = () => {

    const [search, setSearch] = useState(SearchService.getState());

    useEffect(() => {
        SearchService.attach(setSearch);

        return () => {
            SearchService.detach(setSearch);
        };
    }, []);

    return [search];

};

export default useSearchService;
