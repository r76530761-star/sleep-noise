<template>
  <view class="page home">
    <view class="scene">
      <view class="moon" />
      <view class="star star--one" />
      <view class="star star--two" />
      <view class="ridge ridge--back" />
      <view class="ridge ridge--front" />
      <view class="lake lake--one" />
      <view class="lake lake--two" />
      <view class="moon-path" />
    </view>

    <view class="content">
      <text class="brand">Drift</text>

      <view class="timer-shell" @tap="startSleep">
        <view class="timer-ring">
          <text class="timer-label">今晚</text>
          <text class="timer-value">30:00</text>
          <text class="timer-action">轻触开始</text>
        </view>
      </view>

      <button class="start-button" @tap="startSleep">开始入睡</button>

      <view class="recommend-card">
        <view class="protocol-icon">
          <text class="protocol-mark">≈</text>
        </view>
        <view class="recommend-copy">
          <text class="card-kicker">今晚推荐</text>
          <text class="protocol-title">{{ selectedProtocol.title }}</text>
          <text class="protocol-meta">{{ selectedProtocol.localizedMixLabel }}</text>
          <text class="protocol-note">30分钟 · {{ selectedProtocol.localizedFadeLabel }}</text>
        </view>
        <button class="change-button" @tap="openProtocols">更换助眠 →</button>
      </view>

      <view class="mode-card">
        <view class="mode-icon">
          <text class="mode-mark">☾</text>
        </view>
        <view class="mode-copy">
          <text class="mode-title">入睡模式</text>
          <text class="mode-text">30分钟入睡旅程</text>
          <text class="mode-caption">渐隐结束，无需整夜播放</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getPrimaryProtocol, getProtocolById } from '../../services/protocol-service'
import { getDefaultProtocolId } from '../../services/storage-service'

const selectedProtocolId = ref(getDefaultProtocolId() ?? getPrimaryProtocol().id)
const selectedProtocol = computed(() => getProtocolById(selectedProtocolId.value) ?? getPrimaryProtocol())

onShow(() => {
  selectedProtocolId.value = getDefaultProtocolId() ?? getPrimaryProtocol().id
})

function startSleep(): void {
  uni.navigateTo({
    url: `/pages/player/index?protocol=${selectedProtocol.value.id}`,
  })
}

function openProtocols(): void {
  uni.navigateTo({
    url: '/pages/protocols/index',
  })
}
</script>

<style scoped lang="scss">
.home {
  position: relative;
  overflow: hidden;
  padding-bottom: 112px;
}

.scene {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 42%, rgba(129, 128, 220, 0.2), transparent 26%),
    linear-gradient(180deg, #061630 0%, #061225 44%, #030713 100%);
}

.content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.brand {
  margin-top: 24px;
  color: #f4f0e8;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  line-height: 34px;
}

.moon {
  position: absolute;
  top: 104px;
  left: 50px;
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
  background: rgba(230, 238, 255, 0.66);
}

.star--one {
  top: 122px;
  right: 80px;
}

.star--two {
  top: 214px;
  left: 84px;
}

.ridge {
  position: absolute;
  right: -20px;
  left: -20px;
  height: 86px;
  background: rgba(5, 10, 20, 0.72);
  clip-path: polygon(0 68%, 12% 48%, 24% 58%, 36% 36%, 50% 62%, 64% 45%, 78% 56%, 92% 38%, 100% 62%, 100% 100%, 0 100%);
}

.ridge--back {
  top: 326px;
  opacity: 0.52;
}

.ridge--front {
  top: 352px;
}

.lake {
  position: absolute;
  right: 46px;
  left: 46px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(218, 224, 255, 0.46), transparent);
}

.lake--one {
  top: 396px;
}

.lake--two {
  top: 408px;
  opacity: 0.52;
}

.moon-path {
  position: absolute;
  top: 382px;
  left: 50%;
  width: 88px;
  height: 54px;
  border-radius: 50%;
  background: radial-gradient(ellipse, rgba(246, 210, 139, 0.28), transparent 68%);
  transform: translateX(-50%);
}

.timer-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 252px;
  height: 252px;
  margin: 52px auto 24px;
  border: 1px solid rgba(223, 229, 255, 0.22);
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(54, 80, 130, 0.58), rgba(8, 16, 33, 0.2) 62%, transparent 63%),
    conic-gradient(from 22deg, rgba(240, 227, 218, 0.86), rgba(164, 132, 252, 0.82), rgba(70, 96, 154, 0.32), rgba(240, 227, 218, 0.86));
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.46);
}

.timer-ring {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 214px;
  height: 214px;
  border: 1px solid rgba(246, 241, 230, 0.16);
  border-radius: 50%;
  background: rgba(7, 17, 35, 0.84);
}

.timer-label {
  color: #c3c9df;
  font-size: 15px;
}

.timer-value {
  margin-top: 12px;
  color: #fff7ed;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 54px;
  line-height: 60px;
}

.timer-action {
  margin-top: 8px;
  color: #c9d4ea;
  font-size: 15px;
}

.start-button {
  height: 56px;
  color: #08101f;
  font-size: 17px;
  line-height: 56px;
  background: linear-gradient(135deg, #fff2d8, #c7c9ff);
  border-radius: 999px;
  box-shadow: 0 16px 36px rgba(167, 156, 255, 0.2);
}

.recommend-card,
.mode-card {
  display: flex;
  gap: 14px;
  align-items: center;
  border: 1px solid rgba(212, 224, 255, 0.14);
  border-radius: 8px;
  background: rgba(13, 24, 47, 0.68);
}

.recommend-card {
  margin-top: 24px;
  padding: 16px;
}

.mode-card {
  margin-top: 14px;
  padding: 16px;
  background: rgba(12, 22, 42, 0.5);
}

.protocol-icon,
.mode-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 42%, rgba(167, 156, 255, 0.26), transparent 68%),
    rgba(167, 156, 255, 0.12);
}

.protocol-mark {
  color: #c7b8ff;
  font-size: 30px;
}

.mode-mark {
  color: #f6d28b;
  font-size: 24px;
}

.recommend-copy,
.mode-copy {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.card-kicker {
  color: #aab5d0;
  font-size: 12px;
}

.protocol-title,
.mode-title {
  color: #f5f1ea;
  font-size: 20px;
  font-weight: 600;
}

.protocol-meta,
.mode-text {
  color: #c9d4ea;
  font-size: 14px;
}

.protocol-note {
  color: #b9a9ff;
  font-size: 13px;
}

.mode-caption {
  color: #8f9bb8;
  font-size: 13px;
}

.change-button {
  flex: 0 0 auto;
  height: 36px;
  padding: 0 2px;
  color: #bfc8e6;
  font-size: 13px;
  line-height: 36px;
  background: transparent;
}
</style>
