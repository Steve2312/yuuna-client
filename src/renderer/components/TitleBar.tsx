import React, {useEffect, useState} from "react";
import styles from "@/styles/titlebar.module.scss";
import clamp from "@/utils/Clamp";

type Props = {
    title: string,
    src: string,
    scrollableElementRef: React.RefObject<HTMLDivElement>
}

const TitleBar: React.FC<Props> = ({title, src, scrollableElementRef}) => {

    const [scrollTop, setScrollTop] = useState<number>(0);
    const [firstElementOffsetBottom, setFirstElementOffsetBottom] = useState<number>(0);

    const headerImage = {
        backgroundImage: `linear-gradient(var(--banner-overlay), var(--banner-overlay)), url(${src})`,
    }

    useEffect(() => {
        const scrollableElement = scrollableElementRef?.current;

        if (scrollableElement) {
            updateOffsetFirstElement();
            scrollableElement.addEventListener("scroll", updateScrollTop);
            window.addEventListener("resize", updateOffsetFirstElement);
            return () => {
                scrollableElement.removeEventListener("scroll", updateScrollTop);
                window.removeEventListener("resize", updateOffsetFirstElement);
            }
        }
    }, [scrollableElementRef])

    const updateScrollTop = (event: Event) => {
        const element = event.target as HTMLDivElement;
        setScrollTop(element.scrollTop);
    }

    const updateOffsetFirstElement = () => {
        const firstElement = scrollableElementRef.current?.firstElementChild as HTMLDivElement;
        if (firstElement) {
            const firstElementOffsetBottom = firstElement.offsetTop + firstElement.offsetHeight;
            setFirstElementOffsetBottom(firstElementOffsetBottom);
        }
    }

    const backToTop = () => {
        const scrollableElement = scrollableElementRef.current;
        if (scrollableElement) scrollableElement.scrollTo({
            top: 0
        })
    }

    const titleBarOpacity = firstElementOffsetBottom ? (scrollTop - firstElementOffsetBottom + 95) / 70 : 0
    const titleBarStyle = {
        opacity: clamp(titleBarOpacity, 0, 1)
    }

    const titleBarItemOpacity = scrollTop > firstElementOffsetBottom - 50 ? 1 : 0;
    const titleBarItemTransformY = scrollTop > firstElementOffsetBottom - 50 ? 0 : 50;
    const titleBarItemStyle = {
        opacity: titleBarItemOpacity,
        transform: 'translateY(' + titleBarItemTransformY + '%)',
    }

    return (
        <div className={styles.titleBar} style={titleBarStyle}>
            <span className={styles.title} style={titleBarItemStyle}>{title}</span>
            <span className={styles.backToTop} style={titleBarItemStyle} onClick={backToTop}>Back to top</span>
            <div className={styles.titleBarImage} style={headerImage}/>
        </div>
    );
}

export default TitleBar;