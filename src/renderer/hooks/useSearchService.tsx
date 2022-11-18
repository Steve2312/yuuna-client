import { useEffect, useState } from 'react'
import SearchService, { SearchServiceStateProps } from '@/services/SearchService'

const useSearchService = (): [SearchServiceStateProps] => {

    const [search, setSearch] = useState(SearchService.getState())

    useEffect(() => {
        SearchService.attach(setSearch)

        return () => {
            SearchService.detach(setSearch)
        }
    }, [])

    return [search]

}

export default useSearchService