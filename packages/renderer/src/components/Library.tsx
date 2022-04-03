import React from "react";
import Banner from "@/components/Banner";
import LibraryBanner from '../assets/banners/library.png';

const Library: React.FC = () => {
    return (
        <Banner title="Library" src={LibraryBanner} />
    );
}

export default Library;