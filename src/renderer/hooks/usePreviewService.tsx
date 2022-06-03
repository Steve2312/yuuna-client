import {useEffect, useState} from "react";
import PreviewService from "@/services/PreviewService";


const usePreviewService = () => {

    const [preview, setPreview] = useState(PreviewService.getState());

    useEffect(() => {
        PreviewService.attach(setPreview);

        return () => {
            PreviewService.detach(setPreview);
        };
    }, []);

    return [preview];

};

export default usePreviewService;