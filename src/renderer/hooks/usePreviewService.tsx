import { useEffect, useState } from 'react'
import PreviewService, { PreviewServiceStateProps } from '@/services/PreviewService'


const usePreviewService = (): [PreviewServiceStateProps] => {

    const [preview, setPreview] = useState(PreviewService.getState())

    useEffect(() => {
        PreviewService.attach(setPreview)

        return () => {
            PreviewService.detach(setPreview)
        }
    }, [])

    return [preview]

}

export default usePreviewService