import React, { useEffect } from 'react'
import styles from '@/styles/contextmenu.module.scss'
import useContextMenuService from '@/hooks/useContextMenuService'
import ContextMenuService from '@/services/ContextMenuService'

const ContextMenu: React.FC = () => {
    const [contextMenu] = useContextMenuService()

    useEffect(() => {
        if (contextMenu.buttons.length > 0) {
            window.addEventListener('click', ContextMenuService.close, { once: true })
            window.addEventListener('resize', ContextMenuService.close, { once: true })
            window.addEventListener('wheel', ContextMenuService.close, { once: true })
            // TODO: Doesn't go away when dragging scroll bar
        }
    }, [contextMenu])

    return (
        <>
            {
                contextMenu.buttons.length != 0 &&
                <div className={styles.contextMenu} style={{ top: contextMenu.y, left: contextMenu.x }} onClick={ContextMenuService.close}>
                    {
                        contextMenu.buttons.map((button, index) => {
                            return (
                                <div className={styles.contextMenuButton} onClick={button.onClick} key={index}>
                                    <span>{button.label}</span>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </>
    )
}

export default ContextMenu