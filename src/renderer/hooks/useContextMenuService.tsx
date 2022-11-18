import { useEffect, useState } from 'react'
import ContextMenuService, { ContextMenuStateProps } from '@/services/ContextMenuService'

const useContextMenuService = (): [ContextMenuStateProps] => {

    const [contextMenu, setContextMenu] = useState(ContextMenuService.getState())

    useEffect(() => {
        ContextMenuService.attach(setContextMenu)

        return () => {
            ContextMenuService.detach(setContextMenu)
        }
    }, [])

    return [contextMenu]

}

export default useContextMenuService