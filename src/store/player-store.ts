import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { WechatAudioAdapter } from '../platform/wechat-audio-adapter'
import { AudioService, type AudioSnapshot } from '../services/audio-service'
import { addRecentPlay } from '../services/storage-service'
import type { SleepTimerMinutes } from '../services/timer-service'
import type { AudioTrack } from '../types/audio'

const service = new AudioService(new WechatAudioAdapter())

export const usePlayerStore = defineStore('player', () => {
  const snapshot = ref<AudioSnapshot>(service.getSnapshot())

  const currentTrack = computed(() => snapshot.value.currentTrack)
  const isPlaying = computed(() => snapshot.value.state === 'playing')

  async function play(track: AudioTrack): Promise<void> {
    snapshot.value = await service.play(track)
    addRecentPlay(track.id)
  }

  async function pause(): Promise<void> {
    snapshot.value = await service.pause()
  }

  async function stop(): Promise<void> {
    snapshot.value = await service.stop()
  }

  function setLoop(loop: boolean): void {
    snapshot.value = service.setLoop(loop)
  }

  function startSleepTimer(minutes: SleepTimerMinutes): void {
    snapshot.value = service.startSleepTimer(minutes)
  }

  function cancelSleepTimer(): void {
    snapshot.value = service.cancelSleepTimer()
  }

  return {
    snapshot,
    currentTrack,
    isPlaying,
    play,
    pause,
    stop,
    setLoop,
    startSleepTimer,
    cancelSleepTimer,
  }
})
