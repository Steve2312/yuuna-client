import React, { useRef, useState } from 'react'
import Banner from '@/components/Banner'
import LibraryBanner from '../assets/banners/88738718_p0.jpg'
import useLibraryService from '@/hooks/useLibraryService'
import List from '@/components/List'
import TitleBar from '@/components/TitleBar'
import LibraryCard from '@/components/LibraryCard'
import LibraryMenu from '@/components/LibraryMenu'

const Library: React.FC = () => {

    const listRef = useRef<HTMLDivElement>(null)
    const [input, setInput] = useState<string>('')
    const [library] = useLibraryService()

    const songs = library.songs.filter(song => {
        const keywords = [song.title, song.artist, song.source, song.creator, song.version].join(' ').toUpperCase()
        return keywords.includes(input.toUpperCase())
    })

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
                                <LibraryMenu onInput={setInput} />
                            </>
                        )
                    }
                }
                data={songs}

                keyExtractor={data => data.id}

                render={
                    ({ data, style }) => {
                        return (
                            <LibraryCard song={data} style={style} />
                        )
                    }
                }

                prerenderCount={7}
                componentHeight={70}
                spaceBetween={20}
            />
        </>
    )
}

export default Library