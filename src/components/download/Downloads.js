import React, { useState, useEffect, useContext } from 'react';
import DownloadsCard from './DownloadsCard';
import ShowQueueContext from '../../context/ShowQueueContext';
import DownloadHandler from '../../helpers/DownloadHandler';

function Downloads() {
    const [downloadData, setDownloadData] = useState(DownloadHandler.getDownloadData());
    const [showQueue, setShowQueue] = useContext(ShowQueueContext);

    var downloadQueueClass = showQueue ? 'downloadQueue showDownloadQueue' : 'downloadQueue';
    var arrowIconClass = showQueue ? 'fas fa-long-arrow-alt-right' : 'fas fa-long-arrow-alt-left';

    const cards = downloadData.queue.map(beatmap => 
        <DownloadsCard key={beatmap.id} beatmap={beatmap}/>
    );

    function toggleShowQueue() {
        setShowQueue(data => (!data));
    }

    useEffect(() => {
        DownloadHandler.addObserver(setDownloadData);
        return () => DownloadHandler.removeObserver(setDownloadData);
    }, []);

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

export default Downloads;