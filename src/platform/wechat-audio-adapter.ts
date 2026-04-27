import type { AudioTrack } from '../types/audio'
import type { AudioAdapter } from '../types/platform'

export class WechatAudioAdapter implements AudioAdapter {
  private readonly manager = uni.getBackgroundAudioManager()
  private loop = true
  private currentTrack: AudioTrack | undefined

  async play(track: AudioTrack): Promise<void> {
    this.currentTrack = track
    this.manager.title = track.title
    this.manager.coverImgUrl = track.coverUrl
    this.manager.src = track.audioUrl
    this.manager.play()
  }

  async pause(): Promise<void> {
    this.manager.pause()
  }

  async stop(): Promise<void> {
    this.currentTrack = undefined
    this.manager.stop()
  }

  setLoop(loop: boolean): void {
    this.loop = loop
  }

  onEnded(callback: () => void): void {
    this.manager.onEnded(() => {
      if (this.loop && this.currentTrack) {
        void this.play(this.currentTrack)
        return
      }

      callback()
    })
  }

  onError(callback: (message: string) => void): void {
    this.manager.onError((error: unknown) => {
      callback(typeof error === 'string' ? error : '音频加载失败')
    })
  }
}
