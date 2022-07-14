import React from 'react';
import classNames from '@/utils/ClassNames';
import styles from '@/styles/search-footer.module.scss';
import animations from '@/styles/animations.module.scss';
import useSearchService from '@/hooks/useSearchService';

const SearchFooter: React.FC = () => {
    
    const [search] = useSearchService();

    const getFooterMessage = (): string => {
        if (search.request.error?.code === 'ERR_NETWORK') return 'Connect timeout with the server (╥_╥) \n You\'re either offline or the Beatconnect server are unavailable at the moment.';
        if (search.request.error?.code === 'EAT_AGAIN') return 'DNS lookup timed out (╥_╥) \n You\'re either offline or the Beatconnect server are unavailable at the moment.';
        if (search.request.error) return 'An error has occurred with code: ' + search.request.error.code + '\n You\'re either offline or the Beatconnect server are unavailable at the moment.';

        if (search.request.timeout || search.request.instance) return 'Searching...(´｡• ᵕ •｡`)';
        if (search.results.lastPage && search.results.beatmaps.length == 0) return 'No results...( ; ω ; )';
        if (search.results.lastPage && search.results.beatmaps.length > 0) return 'No more results...(╥_╥)';

        return 'You reached the end ( o ω o )';
    };
    
    return (
        <div className={classNames({
            [styles.searchFooter]: true,
            [animations.breathingOpacity]: search.request.timeout != null || search.request.instance != null
        })}>
            <p>{getFooterMessage()}</p>
        </div>
    );
};

export default SearchFooter;