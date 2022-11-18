import React from 'react'
import logo from '../assets/images/logo.png'
import styles from '../styles/navigation.module.scss'
import OutletService from '@/services/OutletService'

import { MdGetApp, MdLibraryMusic } from 'react-icons/md'

const Navigation: React.FC = () => {

    return (
        <div className={styles.navigation} >

            { process.platform == 'darwin' && <div style={{ height: '40px' }}/> }

            <div className={styles.watermark}>
                <img src={logo} alt="Yuuna"/>
                <span>Yuuna</span>
            </div>

            <ul >
                <li onClick={() => OutletService.navigate('search')}>
                    <MdGetApp/>
                    <span>Download songs</span>
                </li>
                <li onClick={() => OutletService.navigate('library')}>
                    <MdLibraryMusic/>
                    <span>Library</span>
                </li>
                <li>
                    <br />
                </li>
            </ul>
        </div>
    )
}

export default Navigation