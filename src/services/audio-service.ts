import type { AudioTrack } from '../types/audio'
import type { AudioAdapter, PlaybackState } from '../types/platform'
import { SleepTimer, type SleepTimerMinutes } from './timer-service'

export interface AudioSnapshot {
  currentTrack: AudioTrack | undefined
  state: PlaybackState
  loop: boolean
  timerActive: boolean
  errorMessage: string | undefined
}

export class AudioService {
  private currentTrack: AudioTrack | undefined
  private state: PlaybackState = 'idle'
  private loop = true
  private errorMessage: string | undefined
  private readonly sleepTimer: SleepTimer

  constructor(private readonly adapter: AudioAdapter) {
    this.sleepTimer = new SleepTimer(() => {
      void this.stop()
    })

    this.adapter.onEnded(() => {
      this.state = 'paused'
    })

    this.adapter.onError((message) => {
      this.state = 'error'
      this.errorMessage = message
    })
  }

  async play(track: AudioTrack): Promise<AudioSnapshot> {
    this.currentTrack = track
    this.state = 'loading'
    this.errorMessage = undefined
    await this.adapter.play(track)
    this.state = 'playing'
    return this.getSnapshot()
  }

  async pause(): Promise<AudioSnapshot> {
    await this.adapter.pause()
    this.state = 'paused'
    return this.getSnapshot()
  }

  async stop(): Promise<AudioSnapshot> {
    await this.adapter.stop()
    this.state = 'idle'
    this.sleepTimer.cancel()
    return this.getSnapshot()
  }

  setLoop(loop: boolean): AudioSnapshot {
    this.loop = loop
    this.adapter.setLoop(loop)
    return this.getSnapshot()
  }

  startSleepTimer(minutes: SleepTimerMinutes): AudioSnapshot {
    this.sleepTimer.start(minutes)
    return this.getSnapshot()
  }

  cancelSleepTimer(): AudioSnapshot {
    this.sleepTimer.cancel()
    return this.getSnapshot()
  }

  getSnapshot(): AudioSnapshot {
    return {
      currentTrack: this.currentTrack,
      state: this.state,
      loop: this.loop,
      timerActive: this.sleepTimer.isActive(),
      errorMessage: this.errorMessage,
    }
  }
}
