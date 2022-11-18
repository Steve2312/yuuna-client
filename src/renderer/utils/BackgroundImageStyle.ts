import thumbnail from '@/assets/images/no_thumbnail.jpg'
import React from 'react'

const getBackgroundImageStyle = (path: string | null): React.CSSProperties => {
    if (path == null || path == '') {
        return {
            backgroundImage: `url("${thumbnail}")`
        }
    } else {
        const imagePath = path.replaceAll('\\', '/')
        return {
            backgroundImage: `url("${imagePath}"), url("${thumbnail}")`
        }
    }
}

export default getBackgroundImageStyle