import thumbnail from "@/assets/images/no_thumbnail.jpg";
import React from "react";

const getBackgroundImageStyle = (protocol: string, path: string | null): React.CSSProperties => {
    if (path == null || path == "") {
        return {
            backgroundImage: `url("${thumbnail}")`
        }
    } else {
        const imagePath = path.replaceAll('\\', '/');
        return {
            backgroundImage: `url("${protocol + imagePath}"), url("${thumbnail}")`
        }
    }
}

export default getBackgroundImageStyle;