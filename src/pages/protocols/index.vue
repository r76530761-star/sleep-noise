<template>
  <view class="page protocols">
    <view class="scene">
      <view class="star star--one" />
      <view class="star star--two" />
    </view>

    <view class="header">
      <button class="back-button" @tap="goBack">‹</button>
      <text class="title">选择助眠</text>
      <text class="subtitle">选择今晚的陪伴，开始入睡</text>
    </view>

    <scroll-view class="carousel" scroll-x :scroll-left="scrollLeft" @scroll="handleScroll">
      <view class="carousel-track">
        <view class="spacer" />
        <view
          v-for="(protocol, index) in protocols"
          :key="protocol.id"
          class="protocol-card"
          :class="{ 'protocol-card--active': index === selectedIndex }"
          @tap="selectProtocol(index)"
        >
          <view class="icon-shell" :class="`icon-shell--${protocol.icon}`">
            <text class="icon-text">{{ iconText(protocol.icon) }}</text>
          </view>
          <text class="protocol-title">{{ protocol.title }}</text>
          <text class="protocol-meta">{{ protocol.localizedMixLabel }}</text>
          <text class="protocol-tag">{{ protocol.tagline }}</text>
        </view>
        <view class="spacer" />
      </view>
    </scroll-view>

    <view class="dots">
      <text
        v-for="(protocol, index) in protocols"
        :key="protocol.id"
        class="dot"
        :class="{ 'dot--active': index === selectedIndex }"
      />
    </view>

    <button class="confirm-button" @tap="confirmSelection">使用此助眠</button>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { getPrimaryProtocol, getVisibleProtocols } from '../../services/protocol-service'
import { getDefaultProtocolId, setDefaultProtocolId } from '../../services/storage-service'

const protocols = getVisibleProtocols()
const initialProtocolId = getDefaultProtocolId() ?? getPrimaryProtocol().id
const selectedIndex = ref(Math.max(0, protocols.findIndex((protocol) => protocol.id === initialProtocolId)))
const cardStep = 224
const scrollLeft = ref(Math.max(0, selectedIndex.value * cardStep))
const selectedProtocol = computed(() => protocols[selectedIndex.value] ?? getPrimaryProtocol())

function selectProtocol(index: number): void {
  selectedIndex.value = index
  scrollLeft.value = Math.max(0, index * cardStep)
}

function handleScroll(event: { detail?: { scrollLeft?: number } }): void {
  const nextIndex = Math.round((event.detail?.scrollLeft ?? 0) / cardStep)
  selectedIndex.value = Math.min(protocols.length - 1, Math.max(0, nextIndex))
}

function confirmSelection(): void {
  setDefaultProtocolId(selectedProtocol.value.id)
  uni.navigateBack()
}

function goBack(): void {
  uni.navigateBack()
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
  padding-bottom: 118px;
}

.scene {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 32%, rgba(139, 122, 230, 0.18), transparent 28%),
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

.carousel {
  position: relative;
  z-index: 1;
  width: 100%;
  margin-top: 42px;
  white-space: nowrap;
}

.carousel-track {
  display: inline-flex;
  gap: 14px;
  align-items: center;
}

.spacer {
  flex: 0 0 auto;
  width: 34px;
  height: 1px;
}

.protocol-card {
  display: inline-flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  width: 210px;
  min-height: 350px;
  padding: 30px 18px 22px;
  border: 1px solid rgba(212, 224, 255, 0.16);
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 25%, rgba(169, 137, 255, 0.18), transparent 30%),
    rgba(11, 22, 44, 0.72);
  box-sizing: border-box;
  opacity: 0.58;
  transform: scale(0.86);
  transition: transform 180ms ease, opacity 180ms ease, border-color 180ms ease;
  white-space: normal;
}

.protocol-card--active {
  border-color: rgba(227, 220, 255, 0.72);
  opacity: 1;
  transform: scale(1);
  box-shadow: 0 24px 64px rgba(117, 96, 210, 0.24);
}

.icon-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 116px;
  height: 116px;
  margin-bottom: 44px;
  border-radius: 50%;
  background: rgba(167, 156, 255, 0.14);
}

.icon-shell--wave {
  background:
    radial-gradient(circle at 50% 48%, rgba(139, 122, 230, 0.3), transparent 68%),
    linear-gradient(180deg, rgba(30, 42, 84, 0.9), rgba(14, 26, 55, 0.78));
}

.icon-shell--moon-tide {
  background:
    radial-gradient(circle at 42% 38%, rgba(246, 210, 139, 0.26), transparent 28%),
    rgba(22, 34, 68, 0.82);
}

.icon-shell--rain {
  background:
    radial-gradient(circle at 50% 82%, rgba(139, 122, 230, 0.26), transparent 30%),
    rgba(13, 28, 52, 0.82);
}

.icon-shell--arc {
  background:
    radial-gradient(circle at 50% 92%, rgba(246, 210, 139, 0.22), transparent 30%),
    rgba(19, 29, 57, 0.82);
}

.icon-text {
  color: #c7b8ff;
  font-size: 40px;
}

.protocol-title {
  color: #f5f1ea;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
}

.protocol-meta {
  margin-top: 12px;
  color: #c9d4ea;
  font-size: 15px;
  text-align: center;
}

.protocol-tag {
  margin-top: 18px;
  padding: 8px 14px;
  color: #c7b8ff;
  font-size: 12px;
  border: 1px solid rgba(199, 184, 255, 0.28);
  border-radius: 999px;
}

.dots {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 26px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(174, 184, 212, 0.35);
}

.dot--active {
  background: #c7b8ff;
}

.confirm-button {
  position: fixed;
  right: 24px;
  bottom: 38px;
  left: 24px;
  z-index: 2;
  height: 56px;
  color: #08101f;
  font-size: 17px;
  line-height: 56px;
  background: linear-gradient(135deg, #fff2d8, #c7c9ff);
  border-radius: 999px;
}
</style>
