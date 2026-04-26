import type { AudioTrack } from './audio'

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export interface AudioAdapter {
  play(track: AudioTrack): Promise<void>
  pause(): Promise<void>
  stop(): Promise<void>
  setLoop(loop: boolean): void
  onEnded(callback: () => void): void
  onError(callback: (message: string) => void): void
}
