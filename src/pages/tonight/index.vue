<template>
  <view class="page tonight nfc-tonight">
    <view class="sky">
      <view class="moon" />
      <view class="star star--one" />
      <view class="star star--two" />
    </view>

    <view class="content">
      <view class="shell-detected">
        <text class="shell-dot" />
        <text class="shell-text">Sleep Shell detected</text>
      </view>

      <view class="brand-row">
        <text class="brand">Drift</text>
      </view>

      <view class="timer-shell">
        <view class="timer-ring">
          <text class="timer-label">今晚</text>
          <text class="timer-value">30:00</text>
          <text class="timer-action">轻触开始</text>
        </view>
      </view>

      <button class="start-button" @tap="startDescent">
        {{ player.isPlaying ? '入睡仪式已开启' : '开始入睡' }}
      </button>

      <view class="protocol-card">
        <view class="pulse">
          <text class="pulse-mark">~</text>
        </view>
        <view class="protocol-copy">
          <text class="protocol-title">{{ selectedProtocol.title }}</text>
          <text class="protocol-meta">{{ selectedProtocol.localizedMixLabel }}</text>
          <text class="protocol-note">30分钟 · {{ selectedProtocol.localizedFadeLabel }}</text>
        </view>
      </view>

      <view class="shell-card">
        <view class="shell-icon">
          <text class="shell-mark">T</text>
        </view>
        <view class="shell-copy">
          <text class="shell-title">已通过 Tide Shell 启动</text>
          <text class="shell-caption">今晚进入 {{ selectedProtocol.title }}</text>
        </view>
      </view>
    </view>
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
      title: '协议音频不可用',
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

.content {
  position: relative;
  z-index: 1;
}

.moon {
  position: absolute;
  top: 92px;
  right: 52px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  box-shadow: -9px 3px 0 #f6d28b;
  opacity: 0.78;
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(230, 238, 255, 0.72);
}

.star--one {
  top: 104px;
  left: 54px;
}

.star--two {
  top: 196px;
  right: 76px;
}

.shell-detected {
  display: inline-flex;
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

.brand-row {
  display: flex;
  justify-content: center;
  margin-top: 28px;
}

.brand {
  color: #d8dcf4;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 24px;
  line-height: 30px;
}

.timer-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 282px;
  height: 282px;
  margin: 34px auto 22px;
  border: 1px solid rgba(223, 229, 255, 0.24);
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(52, 79, 128, 0.58), rgba(8, 16, 33, 0.18) 62%, transparent 63%),
    conic-gradient(from 22deg, rgba(241, 226, 213, 0.86), rgba(169, 137, 255, 0.82), rgba(103, 136, 200, 0.32), rgba(241, 226, 213, 0.86));
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.44),
    0 28px 42px rgba(118, 122, 204, 0.14);
}

.timer-ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 236px;
  height: 236px;
  border: 1px solid rgba(246, 241, 230, 0.18);
  border-radius: 50%;
  background: rgba(7, 17, 35, 0.8);
}

.timer-label {
  color: #c3c9df;
  font-size: 15px;
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

.start-button {
  width: 100%;
  height: 56px;
  color: #08101f;
  font-size: 17px;
  line-height: 56px;
  background: linear-gradient(135deg, #fff2d8, #c7c9ff);
  border-radius: 999px;
  box-shadow: 0 16px 36px rgba(167, 156, 255, 0.2);
}

.protocol-card,
.shell-card {
  border: 1px solid rgba(212, 224, 255, 0.14);
  border-radius: 8px;
  background: rgba(13, 24, 47, 0.68);
}

.protocol-card {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-top: 18px;
  padding: 18px;
}

.pulse,
.shell-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(167, 156, 255, 0.16);
}

.pulse-mark,
.shell-mark {
  color: #c7b8ff;
  font-size: 28px;
}

.protocol-copy,
.shell-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
}

.protocol-title {
  color: #f5f1ea;
  font-size: 22px;
  font-weight: 600;
}

.protocol-meta {
  color: #c9d4ea;
  font-size: 15px;
}

.protocol-note {
  color: #b9a9ff;
  font-size: 14px;
}

.shell-card {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-top: 14px;
  padding: 15px 16px;
  background: rgba(12, 22, 42, 0.54);
}

.shell-icon {
  width: 44px;
  height: 44px;
  background: rgba(246, 210, 139, 0.1);
}

.shell-mark {
  color: #f6d28b;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 20px;
}

.shell-title {
  color: #edf0ff;
  font-size: 15px;
}

.shell-caption {
  color: #8f9bb8;
  font-size: 13px;
}
</style>
