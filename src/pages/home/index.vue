<template>
  <view class="page tonight">
    <view class="sky">
      <view class="moon" />
      <view class="star star--one" />
      <view class="star star--two" />
      <view class="star star--three" />
    </view>

    <view class="header">
      <text class="brand">Drift</text>
      <text class="title">Sleep Descent</text>
      <text class="subtitle">A gentle 30-minute ritual from waking into sleep.</text>
    </view>

    <view class="timer-shell" @tap="startDescent">
      <view class="timer-ring">
        <text class="timer-label">Tonight</text>
        <text class="timer-value">30:00</text>
        <text class="timer-action">{{ player.isPlaying ? 'Drifting' : 'Tap to begin' }}</text>
      </view>
    </view>

    <button class="start-button" @tap="startDescent">
      {{ player.isPlaying ? 'Sleep Descent Active' : 'Start Sleep Descent' }}
    </button>

    <view class="protocol-switch">
      <button
        v-for="protocol in protocols"
        :key="protocol.id"
        class="protocol-pill"
        :class="{
          'protocol-pill--active': protocol.id === selectedProtocolId,
          'protocol-pill--reserved': protocol.status === 'reserved',
        }"
        @tap="selectProtocol(protocol.id)"
      >
        {{ protocol.title }}
      </button>
    </view>

    <view class="protocol-card">
      <view class="pulse">
        <text class="pulse-mark">≋</text>
      </view>
      <view class="protocol-copy">
        <text class="protocol-title">{{ selectedProtocol.title }}</text>
        <text class="protocol-meta">{{ selectedProtocol.mixLabel }}</text>
        <text class="protocol-note">{{ selectedProtocol.fadeLabel }}</text>
      </view>
    </view>

    <view class="ritual-notes">
      <view class="note">
        <text class="note-icon">◷</text>
        <text class="note-title">30 minutes</text>
        <text class="note-caption">single session</text>
      </view>
      <view class="note">
        <text class="note-icon">◌</text>
        <text class="note-title">one ritual</text>
        <text class="note-caption">low effort</text>
      </view>
      <view class="note">
        <text class="note-icon">◐</text>
        <text class="note-title">fade out</text>
        <text class="note-caption">in audio</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getPrimaryProtocol, DRIFT_PROTOCOLS, getProtocolById } from '../../services/protocol-service'
import { recordSleepSession } from '../../services/storage-service'
import { useLibraryStore } from '../../store/library-store'
import { usePlayerStore } from '../../store/player-store'

const library = useLibraryStore()
const player = usePlayerStore()
const protocols = DRIFT_PROTOCOLS
const selectedProtocolId = ref(getPrimaryProtocol().id)

const selectedProtocol = computed(() => getProtocolById(selectedProtocolId.value) ?? getPrimaryProtocol())

function selectProtocol(protocolId: string): void {
  const protocol = getProtocolById(protocolId)
  if (!protocol) {
    return
  }

  if (protocol.status === 'reserved') {
    uni.showToast({
      title: 'Coming soon',
      icon: 'none',
    })
    return
  }

  selectedProtocolId.value = protocol.id
}

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
  player.startSleepTimer(30)
  recordSleepSession()
}
</script>

<style scoped lang="scss">
.tonight {
  position: relative;
  overflow: hidden;
  padding-bottom: 112px;
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

.star--three {
  top: 248px;
  left: 84px;
}

.header {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 8px;
  margin-top: 30px;
  text-align: center;
}

.brand {
  color: #9ea8d8;
  font-size: 13px;
  letter-spacing: 0;
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
  position: relative;
  display: grid;
  place-items: center;
  width: 280px;
  height: 280px;
  margin: 56px auto 22px;
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
  width: 236px;
  height: 236px;
  border: 1px solid rgba(246, 241, 230, 0.2);
  border-radius: 50%;
  background: rgba(7, 18, 36, 0.76);
  backdrop-filter: blur(10px);
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

.start-button {
  width: 100%;
  height: 54px;
  color: #08101f;
  font-size: 16px;
  line-height: 54px;
  background: linear-gradient(135deg, #f7ead0, #b9c3ff);
  border-radius: 999px;
  box-shadow: 0 12px 32px rgba(167, 156, 255, 0.22);
}

.protocol-switch {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 18px;
}

.protocol-pill {
  height: 38px;
  color: #aeb8d4;
  font-size: 13px;
  line-height: 38px;
  background: rgba(18, 29, 52, 0.68);
  border: 1px solid rgba(215, 225, 255, 0.12);
  border-radius: 999px;
}

.protocol-pill--active {
  color: #f5f1ea;
  border-color: rgba(199, 184, 255, 0.7);
}

.protocol-pill--reserved {
  opacity: 0.52;
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

.ritual-notes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 22px;
}

.note {
  display: grid;
  justify-items: center;
  gap: 5px;
  min-height: 78px;
  padding: 12px 6px;
  border-radius: 8px;
  background: rgba(7, 14, 27, 0.48);
}

.note-icon {
  color: #c7b8ff;
  font-size: 20px;
}

.note-title {
  color: #f5f1ea;
  font-size: 12px;
}

.note-caption {
  color: #8f9bb8;
  font-size: 11px;
}
</style>
