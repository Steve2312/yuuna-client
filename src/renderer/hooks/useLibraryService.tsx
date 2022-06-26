import { useEffect, useState } from 'react';
import LibraryService from '@/services/LibraryService';

const useLibraryService = () => {

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