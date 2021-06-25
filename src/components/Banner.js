import React, { useEffect, createRef } from 'react';

import homeBanner from '../assets/banners/home.png';
import searchBanner from '../assets/banners/search.png';
import importBanner from '../assets/banners/import.png';
import libraryBanner from '../assets/banners/library.png';

function Banner(props) {
    const bannerRef = createRef();
    const miniBannerRef = createRef();

    
    const backgroundImage = {
        backgroundImage: `linear-gradient(var(--banner-overlay), var(--banner-overlay)), url(${getBanner()})`
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

    function bannerHandler(event) {
        if (bannerRef.current !== null) {
            var offsetBottom = bannerRef.current.offsetTop + bannerRef.current.offsetHeight;
            if (event.target.scrollTop > offsetBottom) {
                miniBannerRef.current.classList.add("showMiniBanner");
            } else {
                miniBannerRef.current.classList.remove("showMiniBanner");
            }
        }
    }

    function backToTop() {
        document.getElementsByClassName("viewWrapper")[0].scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    useEffect(() => {
        const viewWrapper = document.getElementsByClassName("viewWrapper")[0];
        viewWrapper.addEventListener("scroll", bannerHandler);
        return() => {
            viewWrapper.removeEventListener("scroll", bannerHandler);
        }
    });
    
    return <>
        <div className="miniBanner" style={backgroundImage} ref={miniBannerRef}>
            <p>{props.title}</p>
            <span onClick={backToTop}>Back to top</span>
        </div>
        <div className="banner" style={backgroundImage} ref={bannerRef}>
            <h1>{props.title}</h1>
        </div>
    </>;
}

export default Banner;