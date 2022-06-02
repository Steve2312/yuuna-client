import React, {useRef} from "react";
import Banner from "@/components/Banner";
import LibraryBanner from "../assets/banners/88738718_p0.jpg";
import useLibraryService from "@/hooks/useLibraryService";
import List from "@/components/List";
import TitleBar from "@/components/TitleBar";
import LibraryCard from "@/components/LibraryCard";

const Library: React.FC = () => {

    const listRef = useRef<HTMLDivElement>(null);
    const [library] = useLibraryService();

    return (
        <>
            <TitleBar title="Library" src={LibraryBanner} scrollableElementRef={listRef} />
            <List
                ref={listRef}
                header={
                    () => {
                        return (
                            <>
                                <Banner title="Library" src={LibraryBanner} scrollableElementRef={listRef}/>
                            </>
                        );
                    }
                }
                
                data={library.songs}

                keyExtractor={data => data.id}

                render={
                    ({data, style}) => {
                        return (
                            <LibraryCard song={data} style={style} />
                        );
                    }
                }

                prerenderCount={7}
                componentHeight={70}
                spaceBetween={20}
            />
        </>
    );
};

export default Library;
