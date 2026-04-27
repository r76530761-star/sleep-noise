<template>
  <view class="page tonight nfc-tonight">
    <view class="sky">
      <view class="moon" />
      <view class="star star--one" />
      <view class="star star--two" />
    </view>

    <view class="shell-detected">
      <text class="shell-dot" />
      <text class="shell-text">Sleep Shell detected</text>
    </view>

    <view class="header">
      <text class="brand">Drift</text>
      <text class="title">Sleep Descent</text>
      <text class="subtitle">Your Sleep Shell opened tonight's ritual.</text>
    </view>

    <view class="timer-shell">
      <view class="timer-ring">
        <text class="timer-label">Tonight</text>
        <text class="timer-value">30:00</text>
        <text class="timer-action">Ready when you are</text>
      </view>
    </view>

    <view class="protocol-card">
      <view class="pulse">
        <text class="pulse-mark">~</text>
      </view>
      <view class="protocol-copy">
        <text class="protocol-title">{{ selectedProtocol.title }}</text>
        <text class="protocol-meta">{{ selectedProtocol.mixLabel }}</text>
        <text class="protocol-note">{{ selectedProtocol.fadeLabel }}</text>
      </view>
    </view>

    <button class="start-button" @tap="startDescent">
      {{ player.isPlaying ? 'Sleep Descent Active' : 'Start Sleep Descent' }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { trackNfcEntry } from '../../services/analytics-service'
import { resolveProtocolForEntry } from '../../services/protocol-service'
import {
  getDefaultProtocolId,
  recordSleepSession,
  setDefaultProtocolId,
} from '../../services/storage-service'
import { useLibraryStore } from '../../store/library-store'
import { usePlayerStore } from '../../store/player-store'
import type { SleepProtocol } from '../../types/protocol'

interface TonightQuery {
  source?: string
  protocol?: string
}

const library = useLibraryStore()
const player = usePlayerStore()
const selectedProtocol = ref<SleepProtocol>(
  resolveProtocolForEntry(undefined, getDefaultProtocolId()).protocol,
)

onLoad((query?: TonightQuery) => {
  const resolution = resolveProtocolForEntry(query?.protocol, getDefaultProtocolId())
  selectedProtocol.value = resolution.protocol
  setDefaultProtocolId(resolution.protocol.id)
  trackNfcEntry(query?.source, resolution)
})

async function startDescent(): Promise<void> {
  if (player.isPlaying) {
    return
  }

  const track = library.allTracks.find((item) => item.id === selectedProtocol.value.audioTrackId)
  if (!track) {
    uni.showToast({
      title: 'Protocol audio unavailable',
      icon: 'none',
    })
    return
  }

  await player.play(track)
  player.startSleepTimer(selectedProtocol.value.durationMinutes)
  recordSleepSession()
}
</script>

<style scoped lang="scss">
.nfc-tonight {
  position: relative;
  overflow: hidden;
  padding-bottom: 56px;
}

.sky {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.moon {
  position: absolute;
  top: 112px;
  right: 46px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  box-shadow: -9px 3px 0 #f6d28b;
  opacity: 0.95;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(230, 238, 255, 0.78);
}

.star--one {
  top: 86px;
  left: 54px;
}

.star--two {
  top: 162px;
  right: 86px;
}

.shell-detected {
  display: inline-grid;
  grid-auto-flow: column;
  gap: 8px;
  align-items: center;
  margin-top: 24px;
  padding: 8px 12px;
  border: 1px solid rgba(199, 184, 255, 0.2);
  border-radius: 999px;
  background: rgba(15, 25, 48, 0.62);
}

.shell-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c7b8ff;
}

.shell-text {
  color: #c9d4ea;
  font-size: 12px;
}

.header {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 8px;
  margin-top: 34px;
  text-align: center;
}

.brand {
  color: #9ea8d8;
  font-size: 13px;
}

.title {
  color: #f7f0e6;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 34px;
  line-height: 40px;
}

.subtitle {
  max-width: 260px;
  color: #b8c3dc;
  font-size: 14px;
  line-height: 21px;
}

.timer-shell {
  display: grid;
  place-items: center;
  width: 278px;
  height: 278px;
  margin: 50px auto 22px;
  border: 1px solid rgba(206, 219, 255, 0.22);
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(68, 102, 154, 0.48), rgba(7, 16, 31, 0.18) 62%, transparent 63%),
    conic-gradient(from 10deg, rgba(167, 156, 255, 0.95), rgba(125, 168, 217, 0.24), rgba(245, 241, 234, 0.62), rgba(167, 156, 255, 0.95));
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.42);
}

.timer-ring {
  display: grid;
  place-items: center;
  width: 234px;
  height: 234px;
  border: 1px solid rgba(246, 241, 230, 0.2);
  border-radius: 50%;
  background: rgba(7, 18, 36, 0.76);
}

.timer-label {
  color: #d7d7ec;
  font-size: 14px;
}

.timer-value {
  margin-top: 12px;
  color: #fff7ed;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 58px;
  line-height: 64px;
}

.timer-action {
  margin-top: 8px;
  color: #c9d4ea;
  font-size: 15px;
}

.protocol-card {
  display: grid;
  grid-template-columns: 50px 1fr;
  gap: 14px;
  align-items: center;
  margin-top: 20px;
  padding: 16px;
  border: 1px solid rgba(212, 224, 255, 0.16);
  border-radius: 8px;
  background: rgba(15, 25, 48, 0.72);
}

.pulse {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(167, 156, 255, 0.18);
}

.pulse-mark {
  color: #c7b8ff;
  font-size: 28px;
}

.protocol-copy {
  display: grid;
  gap: 4px;
}

.protocol-title {
  color: #f5f1ea;
  font-size: 18px;
  font-weight: 600;
}

.protocol-meta,
.protocol-note {
  color: #aeb8d4;
  font-size: 13px;
}

.start-button {
  width: 100%;
  height: 56px;
  margin-top: 22px;
  color: #08101f;
  font-size: 16px;
  line-height: 56px;
  background: linear-gradient(135deg, #f7ead0, #b9c3ff);
  border-radius: 999px;
  box-shadow: 0 12px 32px rgba(167, 156, 255, 0.22);
}
</style>
