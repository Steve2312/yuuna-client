import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/banner.module.scss';
import clamp from '@/utils/Clamp';

type Props = {
    title: string,
    src: string,
    scrollableElementRef?: React.RefObject<HTMLDivElement>
}

const Banner: React.FC<Props> = ({ title, src, scrollableElementRef }) => {

    const bannerRef = useRef<HTMLDivElement>(null);
    const [bannerOffsetBottom, setBannerOffsetBottom] = useState<number>(0);
    const [scrollTop, setScrollTop] = useState<number>(0);

    const backgroundImage = {
        backgroundImage: `linear-gradient(transparent, var(--bg_1_color)), url(${src})`
    };

    useEffect(() => {
        const scrollableElement = scrollableElementRef?.current;

        if (scrollableElement) {
            updateBannerOffset();
            scrollableElement.addEventListener('scroll', updateScrollTop);
            window.addEventListener('resize', updateBannerOffset);
            return () => {
                scrollableElement.removeEventListener('scroll', updateScrollTop);
                window.removeEventListener('resize', updateBannerOffset);
            };
        }
    }, [scrollableElementRef]);

    const updateScrollTop = (event: Event): void => {
        const element = event.target as HTMLDivElement;
        setScrollTop(element.scrollTop);
    };

    const updateBannerOffset = (): void => {
        const bannerElement = bannerRef.current;
        if (bannerElement) {
            const bannerOffsetBottom = bannerElement.offsetTop + bannerElement.offsetHeight;
            setBannerOffsetBottom(bannerOffsetBottom);
        }
    };

    const titleOpacity = 1 - scrollTop / bannerOffsetBottom;
    const titleStyle = {
        opacity: clamp(titleOpacity, 0, 1)
    };

    const bannerScale = 1 + scrollTop / 500;
    const bannerOpacity = bannerOffsetBottom ? 1 - (scrollTop / bannerOffsetBottom) : 1;
    const bannerStyle = {
        transform: 'scale(' + clamp(bannerScale, 0, 1.75) + ')',
        opacity: clamp(bannerOpacity, 0, 1)
    };

    return (
        <>
            <div className={styles.banner} ref={bannerRef}>
                <h1 style={titleStyle}>{title}</h1>
                <div className={styles.bannerImage} style={{ ...backgroundImage, ...bannerStyle }}/>
            </div>
        </>
    );
};

export default Banner;