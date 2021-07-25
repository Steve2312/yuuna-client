import React, {useEffect, useState} from 'react';

import ShowQueueContext from '../context/ShowQueueContext';
import LibraryContext from '../context/LibraryContext';
import { setLibrarySetter, updateLibrary } from '../helpers/LibraryHandler';

import Toolbar from './Toolbar';
import Downloads from './download/Downloads';
import Watermark from './Watermark';
import NavigationButtons from './navigation/NavigationButtons';
import PlaylistButtons from './navigation/PlaylistButtons';
import View from './View';
import Player from './Player';

import '../renderer/App.css';
import '../assets/fa/css/all.css';

function App() {
  // View switcher
  const [view, setView] = useState(1);

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
        <ShowQueueContext.Provider value={[showQueue, setShowQueue]}>
          <div className={viewWrapperClass} key={view}>
            <View index={view}/>
          </div>
          <Downloads />
        </ShowQueueContext.Provider>
        <div className="playerWrapper">
          <Player />
        </div>
      </LibraryContext.Provider>
    </div>
  </>;
}

export default App;
