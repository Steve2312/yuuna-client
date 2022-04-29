import {useEffect, useState} from "react";
import DownloadService from "@/services/DownloadService";

const useDownloadService = () => {

    const [download, setDownload] = useState(DownloadService.getState());

    useEffect(() => {
        DownloadService.attach(setDownload);

        return () => {
            DownloadService.detach(setDownload);
        }
    }, [])

    return [download];

}

export default useDownloadService;