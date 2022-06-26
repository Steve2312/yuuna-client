import { useEffect, useState } from 'react';
import LibraryService, { LibraryServiceStateProps } from '@/services/LibraryService';

const useLibraryService = (): [LibraryServiceStateProps] => {

    const [library, setLibrary] = useState(LibraryService.getState());

    useEffect(() => {
        LibraryService.attach(setLibrary);

        return () => {
            LibraryService.detach(setLibrary);
        };
    }, []);

    return [library];

};

export default useLibraryService;