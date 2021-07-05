import React, {useEffect, useState} from 'react';
import '../renderer/App.css';
import '../assets/fa/css/all.css';
import Toolbar from './Toolbar';
import DownloadQueue from './DownloadQueue';
import Watermark from './Watermark';
import NavigationButtons from './NavigationButtons';
import PlaylistButtons from './PlaylistButtons';
import View from './View';
import PreviewContext from '../context/PreviewContext';
import PlayerContext from '../context/PlayerContext';
import DownloadQueueContext from '../context/DownloadQueueContext';
import DownloadProgressContext from '../context/DownloadProgressContext';
import Player from './Player';
import {setSetters} from '../helpers/downloadBeatmap';
import ShowQueueContext from '../context/ShowQueueContext';
import LibraryContext from '../context/LibraryContext';
import { setLibrarySetter, updateLibrary } from '../helpers/LibraryHandler';
import { setImportingSetter } from '../helpers/importBeatmap';

function App() {
  // View switcher
  const [view, setView] = useState(1);

  // Preview Audio From Search System
  const [preview, setPreview] = useState({
    audio: new Audio(),
    playing: false,
    id: null,
  });

  // Preview Audio From Search System
  const [player, setPlayer] = useState({
    audio: new Audio(),
    volume: 0.25,
    playing: false,

    playlist: null,
    beatmapset: null,
    id: null,

    title: null,
    artist: null
  });

  // Download queue
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState();
  setSetters(setDownloadQueue, setDownloadProgress);

  // Show queue right hand side of the program
  const [showQueue, setShowQueue] = useState(true);

  const [library, setLibrary] = useState();
  setLibrarySetter(setLibrary);

  useEffect(() => {
    if (!library) {
        updateLibrary();
    }
  }, [library]);

  var viewWrapperClass = showQueue ? 'viewWrapper viewWrapperShrink' : 'viewWrapper';

  return <>
    <div className="appLayout">
      <div className="toolbarWrapper">
        <Toolbar />
      </div>
      <div className="navigationWrapper">
        <Watermark />
        <NavigationButtons viewState={[view, setView]}/>
        <PlaylistButtons />
      </div>
      <LibraryContext.Provider value={[library, setLibrary]}>
        <PlayerContext.Provider value={[player, setPlayer]}>
          <PreviewContext.Provider value={[preview, setPreview]}>
            <DownloadQueueContext.Provider value={[downloadQueue, setDownloadQueue]}>
              <DownloadProgressContext.Provider value={[downloadProgress, setDownloadProgress]}>
                <ShowQueueContext.Provider value={[showQueue, setShowQueue]}>
                  <div className={viewWrapperClass}>
                    <View index={view}/>
                    <DownloadQueue />
                  </div>
                </ShowQueueContext.Provider>
              </DownloadProgressContext.Provider>
            </DownloadQueueContext.Provider>
            <div className="playerWrapper">
              <Player />
            </div>
          </PreviewContext.Provider>
        </PlayerContext.Provider>
      </LibraryContext.Provider>
    </div>
  </>;
}

export default App;
