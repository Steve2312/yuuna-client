import React, {useState} from 'react';

import ShowQueueContext from '../context/ShowQueueContext';

import Toolbar from './Toolbar';
import Downloads from './download/Downloads';
import Watermark from './Watermark';
import NavigationButtons from './navigation/NavigationButtons';
import PlaylistButtons from './navigation/PlaylistButtons';
import View from './View';
import Player from './Player';
import ContextMenu from './ContextMenu';

import '../renderer/app.module.scss';
import '../assets/fa/css/all.css';
import {BrowserRouter} from "react-router-dom";

function AppOld() {
  // View switcher
  const [view, setView] = useState(3);

  // Show queue right hand side of the program
  const [showQueue, setShowQueue] = useState(true);

  var viewWrapperClass = showQueue ? 'viewWrapper viewWrapperShrink' : 'viewWrapper';

  return <>
    <BrowserRouter>
      <ContextMenu/>
      <div className="appLayout">
        <div className="toolbarWrapper">
          <Toolbar />
        </div>
        <div className="navigationWrapper">
          <Watermark />
          <NavigationButtons viewState={[view, setView]}/>
          <PlaylistButtons />
        </div>
        <ShowQueueContext.Provider value={[showQueue, setShowQueue]}>
          <div className={viewWrapperClass} key={view}>
            <View index={view}/>
          </div>
          <Downloads />
        </ShowQueueContext.Provider>
        <div className="playerWrapper">
          <Player />
        </div>
      </div>
    </BrowserRouter>

  </>;
}

export default App;