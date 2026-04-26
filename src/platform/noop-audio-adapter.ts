import type { AudioTrack } from '../types/audio'
import type { AudioAdapter } from '../types/platform'

export class NoopAudioAdapter implements AudioAdapter {
  private endedCallback: (() => void) | undefined
  private errorCallback: ((message: string) => void) | undefined

  async play(_track: AudioTrack): Promise<void> {
    return Promise.resolve()
  }

  async pause(): Promise<void> {
    return Promise.resolve()
  }

  async stop(): Promise<void> {
    return Promise.resolve()
  }

  setLoop(_loop: boolean): void {}

  onEnded(callback: () => void): void {
    this.endedCallback = callback
  }

  onError(callback: (message: string) => void): void {
    this.errorCallback = callback
  }

  triggerEnded(): void {
    this.endedCallback?.()
  }

  triggerError(message: string): void {
    this.errorCallback?.(message)
  }
}
