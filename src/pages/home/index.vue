<template>
  <view class="page home">
    <view class="sky">
      <view class="moon" />
      <view class="star star--one" />
      <view class="star star--two" />
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
          <text class="protocol-mark">~</text>
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
  align-items: stretch;
}

.brand {
  margin-top: 28px;
  color: #f4f0e8;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  line-height: 34px;
  text-align: center;
}

.moon {
  position: absolute;
  top: 104px;
  left: 44px;
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
  top: 92px;
  right: 80px;
}

.star--two {
  top: 260px;
  left: 86px;
}

.timer-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 282px;
  height: 282px;
  margin: 34px auto 24px;
  border: 1px solid rgba(223, 229, 255, 0.24);
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(54, 80, 130, 0.58), rgba(8, 16, 33, 0.18) 62%, transparent 63%),
    conic-gradient(from 20deg, rgba(240, 227, 218, 0.88), rgba(164, 132, 252, 0.82), rgba(103, 136, 200, 0.32), rgba(240, 227, 218, 0.88));
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.46);
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
  background: rgba(7, 17, 35, 0.82);
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
  background: rgba(167, 156, 255, 0.16);
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
