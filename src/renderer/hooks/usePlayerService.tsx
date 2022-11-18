import { useEffect, useState } from 'react'
import PlayerService, { PlayerServiceStateProps } from '@/services/PlayerService'

const usePlayerService = (): [PlayerServiceStateProps] => {

    const [player, setPlayer] = useState(PlayerService.getState())

    useEffect(() => {
        PlayerService.attach(setPlayer)

        return () => {
            PlayerService.detach(setPlayer)
        }
    }, [])

    return [player]
}

export default usePlayerService