import React, {useState} from 'react';
import '../renderer/App.css';
import '../assets/fa/css/all.css';
import Toolbar from './Toolbar';
import Watermark from './Watermark';
import NavigationButtons from './NavigationButtons';
import PlaylistButtons from './PlaylistButtons';
import View from './View';
import PreviewContext from '../context/PreviewContext';

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
  searchAudio.autoplay = true;

  // Get volume from the main player
  searchAudio.volume = 0.06;
  searchAudio.onended = () => {
    setPreview(data => ({...data, id: null, playing: false}));
  }

  const [preview, setPreview] = useState({
    playPreview: function (id, preview) {
      if (id === preview.id) {
        searchAudio.paused ? searchAudio.play() : searchAudio.pause();
        setPreview(data => ({...data, playing: !searchAudio.paused}));
      } else {
        searchAudio.src = `https://b.ppy.sh/preview/${id}.mp3`;
        setPreview(data => ({...data, id: id, playing: true}));
      }
    },
    id: null,
    playing: false
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
      <PreviewContext.Provider value={[preview, setPreview]}>
        <div className="viewWrapper">
          <View index={view} />
        </div>
        <div className="playerWrapper"></div>
      </PreviewContext.Provider>
    </div>
  </>;
}

export default App;
