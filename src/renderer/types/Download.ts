import Beatmap from '@/types/Beatmap'

type Download = {
    beatmap: Beatmap,
    percentage: number | null,
    status: 'Waiting' | 'Initializing' | 'Downloading' | 'Importing' | 'Failed'
}

export default Download