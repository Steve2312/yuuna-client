import React from 'react'
import styles from '../styles/app.module.scss'

import Window from '@/components/Window'
import Navigation from '@/components/Navigation'
import Outlet from '@/components/Outlet'
import Player from '@/components/Player'
import Downloads from '@/components/Downloads'
import classNames from '@/utils/ClassNames'

const App: React.FC = () => {
    return (
        <div className={classNames({
            [styles.app]: true,
            [styles.darwin]: process.platform == 'darwin'
        })}>
            <Window />
            <Navigation />
            <div className={styles.outlet}>
                <Outlet />
            </div>
            <Downloads />
            <Player />
        </div>
    )
}

export default App