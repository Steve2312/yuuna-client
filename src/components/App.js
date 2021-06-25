import React, {useState} from 'react';
import '../renderer/App.css';
import '../assets/fa/css/all.css';
import Toolbar from './Toolbar';
import Watermark from './Watermark';
import NavigationButtons from './NavigationButtons';
import PlaylistButtons from './PlaylistButtons';
import View from './View';

function App() {

  const [view, setView] = useState(1);

  function switchView(index) {
    if (index !== view) {
      setView(index);
    }
  }

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
      <div className="viewWrapper">
        <View index={view} />
      </div>
      <div className="playerWrapper"></div>
    </div>
  </>;
}

export default App;
