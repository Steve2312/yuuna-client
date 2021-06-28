import React, { useContext } from 'react';
import DownloadQueueContext from '../context/DownloadQueueContext';
import DownloadQueueCard from './DownloadQueueCard';
import ShowQueueContext from '../context/ShowQueueContext';

function downloadQueue() {
    const [downloadQueue, setDownloadQueue] = useContext(DownloadQueueContext);
    const [showQueue, setShowQueue] = useContext(ShowQueueContext);

    var downloadQueueClass = showQueue ? 'downloadQueue showDownloadQueue' : 'downloadQueue';
    var arrowIconClass = showQueue ? 'fas fa-long-arrow-alt-right' : 'fas fa-long-arrow-alt-left';

    const cards = downloadQueue.map(beatmap => 
        <DownloadQueueCard key={beatmap.id} beatmap={beatmap}/>
    );

    function toggleShowQueue() {
        setShowQueue(data => (!data));
    }
    return <>
        <div className={downloadQueueClass}>
            <div className="header">
                <span className="toggleButton" onClick={toggleShowQueue}><i className={arrowIconClass}></i></span>
                <h1>Downloads</h1>
            </div>
            <div className="downloadQueueCardWrapper">
                {cards.length != 0 ? cards : <span className="emptyQueueMessage">Download queue is empty :(</span>}
            </div>
        </div>
    </>;
}

export default downloadQueue;