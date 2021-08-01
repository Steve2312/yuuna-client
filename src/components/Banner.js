import React, { useEffect, createRef, useContext, useState } from 'react';

import homeBanner from '../assets/banners/home.png';
import searchBanner from '../assets/banners/search.png';
import importBanner from '../assets/banners/import.png';
import libraryBanner from '../assets/banners/1067786.png';
import ShowQueueContext from '../context/ShowQueueContext';
import { clamp } from '../helpers/utils';

function Banner(props) {
    const bannerRef = createRef();
    const [scrollTop, setScrollTop] = useState(0);
    const [bannerOffsetBottom, setBannerOffsetBottom] = useState(null);

    const [showQueue] = useContext(ShowQueueContext);
    const miniBannerWrapperClass = showQueue ? 'miniBannerWrapper miniBannerShrink' : 'miniBannerWrapper';

    const titleOpacity = 1 - scrollTop / 200;
    const title = {
        opacity: clamp(titleOpacity, 0, 1)
    }

    const headerOpacity = bannerOffsetBottom ? (scrollTop - bannerOffsetBottom + 95) / 70 : 0
    const header = {
        display: headerOpacity == 0 ? "none" : "flex",
        opacity: clamp(headerOpacity, 0, 1)
    }

    const scale = 1 + scrollTop / 500;
    const blur = scrollTop / 100;
    const banner = {
        transform: 'scale(' + clamp(scale, 0, 1.75) + ')',
        filter: 'blur(' + clamp(blur, 0, 5) + 'px)'
    }

    const headerItemOpacity = scrollTop > bannerOffsetBottom - 50 ? 1 : 0;
    const headerItemTransformY = scrollTop > bannerOffsetBottom - 50 ? 0 : 50;
    const headerItem = {
        opacity: headerItemOpacity,
        transform: 'translateY(' + headerItemTransformY + '%)',
    }

    const bannerImage = {
        backgroundImage: `linear-gradient(transparent, var(--bg_1_color)), url(${getBanner()})`,
    }

    const headerImage = {
        backgroundImage: `linear-gradient(var(--banner-overlay), var(--banner-overlay)), url(${getBanner()})`,
    }

    function getBanner() {
        switch (props.banner) {
            case "home":
                return homeBanner;
            case "search":
                return searchBanner;
            case "import":
                return importBanner;
            case "library":
                return libraryBanner;
            default:
                return null;
        }
    }

    function updateBannerOffset() {
        if (bannerRef.current !== null) {
            setBannerOffsetBottom(bannerRef.current.offsetTop + bannerRef.current.offsetHeight);
        }
    }

    function updateScrollTop(target) {
        setScrollTop(target.target.scrollTop);
    }

    function backToTop() {
        document.getElementsByClassName("viewWrapper")[0].scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        const viewWrapper = document.getElementsByClassName("viewWrapper")[0];
        viewWrapper.addEventListener("scroll", updateScrollTop);
        window.addEventListener("resize", updateBannerOffset);
        updateBannerOffset();
        return() => {
            viewWrapper.removeEventListener("scroll", updateScrollTop);
            window.removeEventListener("resize", updateBannerOffset);
        }
    }, [bannerRef]);
    
    return <>
        <div className={miniBannerWrapperClass} style={header}>
            <p style={headerItem}>{props.title}</p>
            <span style={headerItem} onClick={backToTop}>Back to top</span>
            <div className="miniBanner" style={headerImage}/>
        </div>
        <div className="bannerWrapper">
            <h1 style={title}>{props.title}</h1>
            <div className="banner" style={{...bannerImage, ...banner}} ref={bannerRef} />
        </div>
    </>;
}

export default Banner;