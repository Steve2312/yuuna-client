import React from 'react'
import styles from '@/styles/outlet.module.scss'
import useOutletService from '@/hooks/useOutletService'
import Library from '@/components/Library'
import Search from '@/components/Search'

const Outlet: React.FC = () => {

    const [outlet] = useOutletService()

    const getStyle = (route: string): React.CSSProperties => {
        const style: React.CSSProperties = {
            opacity: 0,
            pointerEvents: 'none',
            zIndex: -1
        }

        if (outlet.route == route) {
            style.opacity = 1
            style.pointerEvents = 'auto'
            style.zIndex = 1
        }

        return style
    }

    return (
        <>
            <div style={getStyle('library')} className={styles.outlet}>
                <Library/>
            </div>

            <div style={getStyle('search')} className={styles.outlet}>
                <Search/>
            </div>
        </>
    )
}

export default Outlet