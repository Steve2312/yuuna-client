import React, { Dispatch, SetStateAction } from 'react'
import styles from '@/styles/librarymenu.module.scss'

type Props = {
    onInput: Dispatch<SetStateAction<string>>
}

const LibraryMenu: React.FC<Props> = ({ onInput }) => {
    return (
        <div className={styles.libraryMenu}>
            <input onInput={(event) => onInput(event.currentTarget.value)} type="search" placeholder="Search"/>
        </div>
    )
}

export default LibraryMenu