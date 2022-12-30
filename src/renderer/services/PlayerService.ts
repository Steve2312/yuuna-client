import Song from '../types/Song'
import { getCoverPath, getSongPath } from '@/utils/Paths'
import MediaSessionService from './MediaSessionService'
import Observable from './Observable'
import PreviewService from '@/services/PreviewService'
import DiscordRichPresence from '@/utils/DiscordRichPresence'

export type PlayerServiceStateProps = {
    audio: HTMLAudioElement,
    playing: boolean,
    shuffled: boolean,
    muted: boolean,
    playbackMode: PlaybackMode,
    playlistName: string,
    playlist: Song[],
    current: Song
}

export enum PlaybackMode {
    Normal = 'NM',
    DoubleTime = 'DT'
}

class PlayerService extends Observable<PlayerServiceStateProps> {

    private audio: HTMLAudioElement = new Audio()

    private playing = false
    private shuffled = false
    private muted = false
    private playback = PlaybackMode.Normal

    private defaultAudioVolume = 0.24
    private volumeBeforeMute = 0

    // Info
    private playlistName: string
    private playlist: Song[]

    private current: Song

    private discordRpc: DiscordRichPresence

    constructor() {
        super()
        this.discordRpc = new DiscordRichPresence()
        this.audio.volume = this.defaultAudioVolume
    }

    public play = async (): Promise<void> => {
        if (this.audio.src) {
            await this.audio.play()
        }
    }

    public pause = async (): Promise<void> => {
        if (this.audio.src) {
            await this.audio.pause()
        }
    }

    public playPause = (): void => {
        if (this.audio) {
            this.audio.paused ? this.play() : this.pause()
        }
    }

    public seek = (time?: number): number => {

        if (time != undefined) {
            this.audio.currentTime = time
        }

        this.updateDiscordRichPresence()

        return this.audio.currentTime
    }

    public volume = (volume?: number): number => {

        if (volume != undefined) {
            this.audio.volume = volume
            this.muted = volume == 0
            this.notify(this.getState())
        }

        return this.audio.volume
    }

    public forward = async (): Promise<void> => {
        const index = this.getNextIndexOfSongInPlaylist()
        if (index != -1) {
            await this.playAtPosition(index)
        
            if (index == 0) {
                await this.pause()
            }
        }
    }

    public backward = async (): Promise<void> => {
        const threshold = 0.5
        const currentTime = this.audio.currentTime

        if (currentTime < threshold) {
            const index = this.getPreviousIndexOfSongInPlaylist()

            if (index != -1) {
                await this.playAtPosition(index)
                return
            }
        }

        this.seek(0)
    }

    public mute = (): void => {

        if (this.muted) {
            this.volume(this.volumeBeforeMute)
            this.muted = false
        } else {
            this.volumeBeforeMute = this.volume()
            this.volume(0)
            this.muted = true
        }

        this.notify(this.getState())
    }

    public doubleTime = (): void => {
        this.playback = this.playback == PlaybackMode.Normal ? PlaybackMode.DoubleTime : PlaybackMode.Normal
        this.handlePlaybackMode()
        this.updateDiscordRichPresence()
        this.notify(this.getState())
    }

    public playAtPosition = async (index: number): Promise<void> => {
        const song: Song = this.playlist[index]
        const songPath = getSongPath(song)
        const volume = this.audio.volume

        try {
            const audio = await this.getPlayableAudioElement(songPath, volume)

            // Pause old playback
            await this.pause()

            // Play new audio
            this.audio = audio
            await this.play()

            // Update state
            this.current = song
            await this.updateMediaSession()
            this.handlePlaybackMode()
            this.notify(this.getState())
        } catch (err) {
            console.error(err)
        }
    }

    public playFromPlaylist = async (playlistName: string, playlist: Song[], index: number): Promise<void> => {
        const song: Song = playlist[index]
        const songPath = getSongPath(song)
        const volume = this.audio.volume

        if (this.current?.id == song.id) {
            this.playPause()
            return
        }

        try {
            const audio = await this.getPlayableAudioElement(songPath, volume)

            // Pause old playback
            await this.pause()

            // Play new audio
            this.audio = audio
            await this.play()

            // Update state
            this.playlistName = playlistName
            this.playlist = playlist
            this.current = song

            await this.updateMediaSession()
            this.handlePlaybackMode()
            // Reshuffle Playlist
            if (this.shuffled) {
                this.shufflePlaylist()
            }

            this.notify(this.getState())

        } catch (err) {
            console.error(err)
        }
    }

    public updateMediaSession = async (): Promise<void> => {
        const coverPath = getCoverPath(this.current)
        await MediaSessionService.display(this.current.title, this.current.artist, coverPath)

        const mediaSession = MediaSessionService.getMediaSession()

        if (mediaSession) {
            mediaSession.setActionHandler('previoustrack', this.backward)
            mediaSession.setActionHandler('nexttrack', this.forward)
            mediaSession.setActionHandler('play', this.play)
            mediaSession.setActionHandler('pause', this.pause)
        }
    }

    public updateDiscordRichPresence = async (): Promise<void> => {
        if (!this.playing) {
            return await this.discordRpc.clearActivity()
        }

        await this.discordRpc.setActivity({
            largeImageKey: 'icon',
            smallImageKey: 'playing',
            details: 'Title: ' + this.current.title + ' (' + this.playback + ')',
            state: 'Artist: ' + this.current.artist,
            startTimestamp: Date.now(),
            endTimestamp: Date.now() + ((this.current.duration - this.audio.currentTime) / this.audio.playbackRate) * 1000
        })
    }

    // TODO: Update playlist when new song is imported
    public shuffle = (): void => {
        this.shuffled ? this.sortPlaylist() : this.shufflePlaylist()
    }

    private shufflePlaylist = (): void => {
        if (this.playlist && this.current) {
            const current = this.current
            const shuffledPlaylist = this.playlist.filter(song => song != current)
                .sort(() => Math.random() - 0.5)

            shuffledPlaylist.unshift(current)

            this.playlist = shuffledPlaylist
        }

        this.shuffled = true
        this.notify(this.getState())
    }

    private sortPlaylist = (): void => {
        if (this.playlist) {
            this.playlist = this.playlist.sort((a, b) => a.index - b.index)
        }
        
        this.shuffled = false
        this.notify(this.getState())
    }

    // Event Handlers
    private handleOnPlay = async (): Promise<void> => {
        this.playing = true
        this.notify(this.getState())

        this.updateDiscordRichPresence()
        MediaSessionService.setPlaybackState('playing')

        const preview = PreviewService.getState()

        if (preview.playing) {
            PreviewService.pause()
        }

        if (preview.loading) {
            PreviewService.cancelAxiosRequest()
        }
    }

    private handleOnPause = async (): Promise<void> => {
        this.playing = false
        this.updateDiscordRichPresence()
        MediaSessionService.setPlaybackState('paused')
        this.notify(this.getState())
    }

    private handleOnTimeUpdate = async (event: Event): Promise<void> => {
        const audio = event.target as HTMLAudioElement
        // Time Left before forwarding!
        const threshold = 0.4

        const duration = audio.duration
        const timeLeft = duration - audio.currentTime

        if (duration && timeLeft <= threshold) {
            
            audio.currentTime = duration - threshold

            if (!audio.paused) {
                audio.ontimeupdate = null
                await this.forward()
            }

        }
    }

    private handlePlaybackMode = (): void => {
        switch (this.playback) {
        case PlaybackMode.Normal:
            this.audio.playbackRate = 1
            break
        case PlaybackMode.DoubleTime:
            this.audio.playbackRate = 1.5
            break
        }
    }

    private getNextIndexOfSongInPlaylist = (): number => {
        const index = this.getIndexOfSongInPlaylist()

        if (index == -1) {
            return index
        }

        return (index + 1) % this.playlist.length
    }

    private getPreviousIndexOfSongInPlaylist = (): number => {
        const index = this.getIndexOfSongInPlaylist()
        
        if (index == -1) {
            return index
        }

        return index - 1 == -1 ? this.playlist.length - 1 : index - 1
    }

    private getIndexOfSongInPlaylist = (): number => {
        for (let i = 0; i < this.playlist.length; i++) {
            const song = this.playlist[i]
            if (song.id == this.current.id) {
                return i
            }
        }

        return -1
    }

    private getPlayableAudioElement = (src: string, volume: number): Promise<HTMLAudioElement> => {
        return new Promise((resolve, reject) => {
            const audio = new Audio()

            audio.volume = volume

            audio.addEventListener('canplay', () => {
                resolve(audio)
            }, {
                once: true
            })

            audio.addEventListener('error', (error: ErrorEvent) => {
                reject(error)
            }, {
                once: true
            })

            audio.addEventListener('play', this.handleOnPlay)
            audio.addEventListener('pause', this.handleOnPause)
            audio.addEventListener('timeupdate', this.handleOnTimeUpdate)

            audio.src = src
        })
    }

    public getState = (): PlayerServiceStateProps => {
        return {
            audio: this.audio,
            playing: this.playing,
            shuffled: this.shuffled,
            muted: this.muted,
            playbackMode: this.playback,
            playlistName: this.playlistName,
            playlist: this.playlist,
            current: this.current
        }
    }
}

export default new PlayerService()