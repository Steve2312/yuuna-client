import React, {useState} from 'react';
import '../renderer/App.css';
import '../assets/fa/css/all.css';
import Toolbar from './Toolbar';
import Watermark from './Watermark';
import NavigationButtons from './NavigationButtons';
import PlaylistButtons from './PlaylistButtons';
import View from './View';
import PreviewContext from '../context/PreviewContext';
import PlayerContext from '../context/PlayerContext';
import Player from './Player';

function App() {

  // View switcher
  const [view, setView] = useState(1);

  function switchView(index) {
    if (index !== view) {
      setView(index);
    }
  }

  // Preview Audio From Search System
  const searchAudio = new Audio();
  const [preview, setPreview] = useState({
    audio: searchAudio,
    playing: false,

    id: null,
  });

  // Preview Audio From Search System
  const playerAudio = new Audio();
  const [player, setPlayer] = useState({
    audio: playerAudio,
    volume: 0.1,
    playing: false,

    playlist: null,
    beatmapset: null,
    id: null,

    title: null,
    artist: null
  });


  return <>
    <div className="appLayout">
      <div className="toolbarWrapper">
        <Toolbar />
      </div>
      <div className="navigationWrapper">
        <Watermark />
        <NavigationButtons switchView={switchView}/>
        <PlaylistButtons />
      </div>
      <PlayerContext.Provider value={[player, setPlayer]}>
        <PreviewContext.Provider value={[preview, setPreview]}>
          <div className="viewWrapper">
            <View index={view} />
          </div>
          <div className="playerWrapper">
            <Player />
          </div>
        </PreviewContext.Provider>
      </PlayerContext.Provider>
    </div>
  </>;
}

export default App;
