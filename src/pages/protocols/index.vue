<template>
  <view class="page protocols" :class="accentClass">
    <view class="scene">
      <view class="star star--one" />
      <view class="star star--two" />
      <view class="moon-haze" />
    </view>

    <view class="header">
      <button class="back-button" @tap="goBack">‹</button>
      <text class="title">选择助眠</text>
      <text class="subtitle">选择今晚助眠方式</text>
    </view>

    <view
      class="cover-flow"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <view
        v-for="card in coverCards"
        :key="card.slot"
        class="protocol-card"
        :class="[`protocol-card--${card.slot}`]"
        @tap="selectCard(card.slot)"
      >
        <view class="icon-shell" :class="`icon-shell--${card.protocol.icon}`">
          <text class="icon-text">{{ iconText(card.protocol.icon) }}</text>
        </view>
        <text class="protocol-title">{{ card.protocol.title }}</text>
        <text class="protocol-meta">{{ card.protocol.localizedMixLabel }}</text>
        <text class="protocol-tag">{{ card.protocol.tagline }}</text>
      </view>
    </view>

    <view class="dots">
      <text
        v-for="(protocol, index) in protocols"
        :key="protocol.id"
        class="dot"
        :class="{ 'dot--active': index === selectedIndex }"
      />
    </view>

    <view class="detail-card">
      <view class="detail-icon" :class="`detail-icon--${selectedProtocol.icon}`">
        <text class="detail-icon-text">{{ iconText(selectedProtocol.icon) }}</text>
      </view>
      <view class="detail-copy">
        <text class="detail-title">{{ selectedProtocol.title }}</text>
        <text class="detail-tagline">{{ selectedProtocol.tagline }}</text>
        <text class="detail-text">{{ detailText }}</text>
      </view>
    </view>

    <button class="confirm-button" @tap="confirmSelection">使用此助眠</button>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getPrimaryProtocol, getVisibleProtocols } from '../../services/protocol-service'
import { getDefaultProtocolId, setDefaultProtocolId } from '../../services/storage-service'
import type { SleepProtocol } from '../../types/protocol'

type CardSlot = 'left' | 'center' | 'right'

interface CoverCard {
  slot: CardSlot
  protocol: SleepProtocol
}

const protocols = getVisibleProtocols()
const initialProtocolId = getDefaultProtocolId() ?? getPrimaryProtocol().id
const selectedIndex = ref(Math.max(0, protocols.findIndex((protocol) => protocol.id === initialProtocolId)))
const touchStartX = ref(0)

const selectedProtocol = computed(() => protocols[selectedIndex.value] ?? getPrimaryProtocol())
const accentClass = computed(() => `accent-${selectedProtocol.value.icon}`)
const detailText = computed(() => detailTextMap[selectedProtocol.value.id] ?? '柔和声音帮助身体慢慢安静下来')
const coverCards = computed<CoverCard[]>(() => [
  { slot: 'left', protocol: protocols[wrappedIndex(selectedIndex.value - 1)] },
  { slot: 'center', protocol: selectedProtocol.value },
  { slot: 'right', protocol: protocols[wrappedIndex(selectedIndex.value + 1)] },
])

const detailTextMap: Record<string, string> = {
  drift01: '稳定的粉噪和海浪声，帮助多数夜晚自然放松',
  drift_deep: '更低、更慢的海潮声，适合进入深层放松',
  rain_night: '细密雨声覆盖杂念，让注意力缓慢沉下来',
  calm_drift: '轻柔氛围音帮助慢慢放松',
}

function selectCard(slot: CardSlot): void {
  if (slot === 'left') {
    moveSelection(-1)
    return
  }

  if (slot === 'right') {
    moveSelection(1)
  }
}

function handleTouchStart(event: { changedTouches?: Array<{ clientX: number }> }): void {
  touchStartX.value = event.changedTouches?.[0]?.clientX ?? 0
}

function handleTouchEnd(event: { changedTouches?: Array<{ clientX: number }> }): void {
  const endX = event.changedTouches?.[0]?.clientX ?? touchStartX.value
  const delta = endX - touchStartX.value

  if (Math.abs(delta) < 34) {
    return
  }

  moveSelection(delta > 0 ? -1 : 1)
}

function moveSelection(offset: number): void {
  selectedIndex.value = wrappedIndex(selectedIndex.value + offset)
}

function confirmSelection(): void {
  setDefaultProtocolId(selectedProtocol.value.id)
  uni.navigateBack()
}

function goBack(): void {
  uni.navigateBack()
}

function wrappedIndex(index: number): number {
  return (index + protocols.length) % protocols.length
}

function iconText(icon: string): string {
  const map: Record<string, string> = {
    wave: '≈',
    'moon-tide': '☾',
    rain: '⋮',
    arc: '∩',
  }

  return map[icon] ?? '≈'
}
</script>

<style scoped lang="scss">
.protocols {
  position: relative;
  overflow: hidden;
  padding-bottom: 120px;
  --accent: #c7b8ff;
  --accent-soft: rgba(199, 184, 255, 0.2);
}

.accent-wave {
  --accent: #c7b8ff;
  --accent-soft: rgba(199, 184, 255, 0.24);
}

.accent-moon-tide {
  --accent: #6f7bd9;
  --accent-soft: rgba(84, 95, 180, 0.28);
}

.accent-rain {
  --accent: #9db1cf;
  --accent-soft: rgba(133, 159, 196, 0.24);
}

.accent-arc {
  --accent: #f4e3c6;
  --accent-soft: rgba(246, 226, 194, 0.22);
}

.scene {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 34%, var(--accent-soft), transparent 28%),
    linear-gradient(180deg, #061630 0%, #061225 42%, #030713 100%);
}

.star {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(230, 238, 255, 0.62);
}

.star--one {
  top: 138px;
  left: 70px;
}

.star--two {
  top: 238px;
  right: 88px;
}

.moon-haze {
  position: absolute;
  top: 408px;
  left: 50%;
  width: 210px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(118, 112, 212, 0.18), transparent 70%);
  transform: translateX(-50%);
}

.header {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
}

.back-button {
  position: absolute;
  top: -2px;
  left: 0;
  width: 40px;
  height: 40px;
  color: #f3f0fb;
  font-size: 34px;
  line-height: 36px;
  background: transparent;
}

.title {
  color: #f4f0e8;
  font-size: 22px;
}

.subtitle {
  color: #aeb8d4;
  font-size: 14px;
}

.cover-flow {
  position: relative;
  z-index: 1;
  height: 360px;
  margin-top: 38px;
}

.protocol-card {
  position: absolute;
  top: 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 26px 16px 20px;
  border: 1px solid rgba(212, 224, 255, 0.14);
  border-radius: 16px;
  background:
    radial-gradient(circle at 50% 24%, rgba(169, 137, 255, 0.18), transparent 30%),
    rgba(11, 22, 44, 0.78);
  box-sizing: border-box;
  transition: transform 180ms ease, opacity 180ms ease, box-shadow 180ms ease;
}

.protocol-card--center {
  left: 50%;
  z-index: 3;
  width: 220px;
  height: 340px;
  border-color: rgba(245, 241, 234, 0.54);
  box-shadow:
    0 0 0 1px var(--accent-soft),
    0 0 34px var(--accent-soft),
    0 24px 64px rgba(4, 8, 18, 0.5);
  opacity: 1;
  transform: translateX(-50%);
}

.protocol-card--left,
.protocol-card--right {
  z-index: 2;
  width: 180px;
  height: 295px;
  opacity: 0.84;
  filter: saturate(0.84);
}

.protocol-card--left {
  left: -82px;
  transform: rotate(-5deg);
}

.protocol-card--right {
  right: -82px;
  transform: rotate(5deg);
}

.icon-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 110px;
  margin-bottom: 38px;
  border-radius: 50%;
  background: rgba(167, 156, 255, 0.14);
}

.protocol-card--center .icon-shell {
  animation: soft-float 3.8s ease-in-out infinite;
}

.protocol-card--left .icon-shell,
.protocol-card--right .icon-shell {
  width: 92px;
  height: 92px;
  margin-bottom: 32px;
}

.icon-shell--wave,
.detail-icon--wave {
  background:
    radial-gradient(circle at 50% 48%, rgba(139, 122, 230, 0.32), transparent 68%),
    linear-gradient(180deg, rgba(30, 42, 84, 0.9), rgba(14, 26, 55, 0.78));
}

.icon-shell--moon-tide,
.detail-icon--moon-tide {
  background:
    radial-gradient(circle at 42% 38%, rgba(246, 210, 139, 0.24), transparent 28%),
    rgba(22, 34, 68, 0.82);
}

.icon-shell--rain,
.detail-icon--rain {
  background:
    radial-gradient(circle at 50% 82%, rgba(139, 122, 230, 0.28), transparent 30%),
    rgba(13, 28, 52, 0.82);
}

.icon-shell--arc,
.detail-icon--arc {
  background:
    radial-gradient(circle at 50% 92%, rgba(246, 210, 139, 0.22), transparent 30%),
    rgba(19, 29, 57, 0.82);
}

.icon-text {
  color: var(--accent);
  font-size: 40px;
}

.protocol-card--left .icon-text,
.protocol-card--right .icon-text {
  font-size: 32px;
}

.protocol-title {
  color: #f5f1ea;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.protocol-card--left .protocol-title,
.protocol-card--right .protocol-title {
  font-size: 20px;
}

.protocol-meta {
  margin-top: 12px;
  color: #c9d4ea;
  font-size: 15px;
  text-align: center;
}

.protocol-card--left .protocol-meta,
.protocol-card--right .protocol-meta {
  font-size: 13px;
}

.protocol-tag {
  margin-top: 18px;
  padding: 8px 14px;
  color: #d6ccff;
  font-size: 12px;
  border: 1px solid rgba(199, 184, 255, 0.28);
  border-radius: 999px;
}

.protocol-card--left .protocol-tag,
.protocol-card--right .protocol-tag {
  padding: 7px 10px;
  font-size: 11px;
}

.dots {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 12px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(174, 184, 212, 0.35);
}

.dot--active {
  background: var(--accent);
}

.detail-card {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 14px;
  align-items: center;
  margin-top: 24px;
  padding: 16px;
  border: 1px solid rgba(212, 224, 255, 0.12);
  border-radius: 14px;
  background: rgba(12, 22, 42, 0.5);
}

.detail-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 54px;
  height: 54px;
  border-radius: 50%;
}

.detail-icon-text {
  color: var(--accent);
  font-size: 24px;
}

.detail-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.detail-title {
  color: #f4f0e8;
  font-size: 17px;
  font-weight: 600;
}

.detail-tagline {
  color: #c7b8ff;
  font-size: 13px;
}

.detail-text {
  color: #8f9bb8;
  font-size: 13px;
  line-height: 19px;
}

.confirm-button {
  position: fixed;
  right: 24px;
  bottom: 38px;
  left: 24px;
  z-index: 4;
  height: 56px;
  color: #08101f;
  font-size: 17px;
  line-height: 56px;
  background: linear-gradient(135deg, #fff2d8, #c7c9ff);
  border-radius: 999px;
}

@keyframes soft-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}
</style>
