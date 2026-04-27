<template>
  <view class="page player">
    <view class="sky">
      <view class="star star--one" />
      <view class="star star--two" />
      <view class="wave wave--one" />
      <view class="wave wave--two" />
    </view>

    <view class="content">
      <view class="topbar">
        <button class="back-button" @tap="finishSleep">⌄</button>
        <text class="brand">Drift</text>
      </view>

      <view class="timer-shell">
        <view class="timer-ring">
          <text class="timer-label">剩余时间</text>
          <text class="timer-value">{{ remainingLabel }}</text>
          <text class="timer-action">正在入睡</text>
        </view>
      </view>

      <text class="protocol-label">
        {{ selectedProtocol.title }} · {{ selectedProtocol.localizedMixLabel }}
      </text>

      <view class="controls">
        <view class="control-item">
          <button class="control-button" @tap="togglePause">
            {{ player.isPlaying ? 'Ⅱ' : '▶' }}
          </button>
          <text class="control-label">{{ player.isPlaying ? '暂停' : '继续' }}</text>
        </view>

        <view class="control-item">
          <button class="control-button" @tap="finishSleep">■</button>
          <text class="control-label">结束</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getPrimaryProtocol, getProtocolById } from '../../services/protocol-service'
import { recordSleepSession } from '../../services/storage-service'
import { useLibraryStore } from '../../store/library-store'
import { usePlayerStore } from '../../store/player-store'
import type { SleepProtocol } from '../../types/protocol'

interface PlayerQuery {
  protocol?: string
}

const library = useLibraryStore()
const player = usePlayerStore()
const selectedProtocol = ref<SleepProtocol>(getPrimaryProtocol())
const remainingSeconds = ref(30 * 60)
let countdown: ReturnType<typeof setInterval> | undefined

const remainingLabel = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

onLoad((query?: PlayerQuery) => {
  selectedProtocol.value = getProtocolById(query?.protocol) ?? getPrimaryProtocol()
  remainingSeconds.value = selectedProtocol.value.durationMinutes * 60
  void startPlayback()
})

onBeforeUnmount(() => {
  clearCountdown()
})

async function startPlayback(): Promise<void> {
  const track = library.allTracks.find((item) => item.id === selectedProtocol.value.audioTrackId)
  if (!track) {
    uni.showToast({
      title: '协议音频不可用',
      icon: 'none',
    })
    return
  }

  await player.play(track)
  player.startSleepTimer(selectedProtocol.value.durationMinutes)
  recordSleepSession()
  startCountdown()
}

async function togglePause(): Promise<void> {
  if (player.isPlaying) {
    await player.pause()
    clearCountdown()
    return
  }

  const track = library.allTracks.find((item) => item.id === selectedProtocol.value.audioTrackId)
  if (track) {
    await player.play(track)
    startCountdown()
  }
}

async function finishSleep(): Promise<void> {
  clearCountdown()
  await player.stop()
  uni.navigateBack()
}

function startCountdown(): void {
  clearCountdown()
  countdown = setInterval(() => {
    remainingSeconds.value = Math.max(0, remainingSeconds.value - 1)
    if (remainingSeconds.value === 0) {
      clearCountdown()
    }
  }, 1000)
}

function clearCountdown(): void {
  if (countdown) {
    clearInterval(countdown)
    countdown = undefined
  }
}
</script>

<style scoped lang="scss">
.player {
  position: relative;
  overflow: hidden;
  padding-bottom: 64px;
}

.sky {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 24px;
}

.back-button {
  position: absolute;
  left: 0;
  width: 38px;
  height: 38px;
  color: #d9def2;
  font-size: 26px;
  line-height: 34px;
  background: transparent;
}

.brand {
  color: #f4f0e8;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  line-height: 34px;
}

.timer-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 306px;
  height: 306px;
  margin-top: 66px;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(32, 49, 88, 0.52), rgba(5, 11, 25, 0.2) 62%, transparent 63%),
    conic-gradient(from 18deg, rgba(163, 130, 255, 0.95), rgba(57, 74, 126, 0.46), rgba(42, 54, 92, 0.42), rgba(163, 130, 255, 0.95));
}

.timer-ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 264px;
  height: 264px;
  border-radius: 50%;
  background: rgba(5, 12, 28, 0.84);
}

.timer-label {
  color: #c3c9df;
  font-size: 15px;
}

.timer-value {
  margin-top: 18px;
  color: #fff7ed;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 62px;
  line-height: 68px;
}

.timer-action {
  margin-top: 16px;
  color: #f5f1ea;
  font-size: 17px;
}

.protocol-label {
  margin-top: 86px;
  color: #b9a9ff;
  font-size: 15px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 74px;
  width: 100%;
  margin-top: 42px;
}

.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 13px;
}

.control-button {
  width: 76px;
  height: 76px;
  color: #f3f0fb;
  font-size: 30px;
  line-height: 76px;
  background: rgba(42, 48, 78, 0.88);
  border: 1px solid rgba(212, 224, 255, 0.16);
  border-radius: 50%;
}

.control-label {
  color: #d4dbef;
  font-size: 15px;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(189, 177, 255, 0.72);
}

.star--one {
  top: 280px;
  left: 44px;
}

.star--two {
  top: 488px;
  right: 74px;
}

.wave {
  position: absolute;
  right: -30px;
  left: -30px;
  height: 92px;
  border-top: 1px solid rgba(157, 146, 255, 0.28);
  border-radius: 50%;
  transform: rotate(-3deg);
}

.wave--one {
  top: 494px;
}

.wave--two {
  top: 526px;
  opacity: 0.58;
  transform: rotate(4deg);
}
</style>
