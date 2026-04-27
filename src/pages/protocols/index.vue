<template>
  <view class="page protocols">
    <view class="header">
      <button class="back-button" @tap="goBack">‹</button>
      <text class="brand">Drift</text>
      <text class="title">选择今晚的助眠</text>
    </view>

    <scroll-view class="carousel" scroll-x>
      <view class="carousel-track">
        <view
          v-for="protocol in protocols"
          :key="protocol.id"
          class="protocol-card"
          :class="{ 'protocol-card--active': protocol.id === selectedProtocolId }"
          @tap="selectProtocol(protocol.id)"
        >
          <view class="icon-shell">
            <text class="icon-text">{{ iconText(protocol.icon) }}</text>
          </view>
          <text class="protocol-title">{{ protocol.title }}</text>
          <text class="protocol-meta">{{ protocol.localizedMixLabel }}</text>
          <text class="protocol-note">30分钟 · {{ protocol.localizedFadeLabel }}</text>
        </view>
      </view>
    </scroll-view>

    <button class="confirm-button" @tap="confirmSelection">使用这个助眠</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getPrimaryProtocol, getVisibleProtocols } from '../../services/protocol-service'
import { getDefaultProtocolId, setDefaultProtocolId } from '../../services/storage-service'

const protocols = getVisibleProtocols()
const selectedProtocolId = ref(getDefaultProtocolId() ?? getPrimaryProtocol().id)

function selectProtocol(protocolId: string): void {
  selectedProtocolId.value = protocolId
}

function confirmSelection(): void {
  setDefaultProtocolId(selectedProtocolId.value)
  uni.navigateBack()
}

function goBack(): void {
  uni.navigateBack()
}

function iconText(icon: string): string {
  const map: Record<string, string> = {
    wave: '~~~',
    'moon-tide': '☾',
    rain: '···',
    arc: '∩',
  }

  return map[icon] ?? '~'
}
</script>

<style scoped lang="scss">
.protocols {
  overflow: hidden;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 26px;
}

.back-button {
  position: absolute;
  top: 26px;
  left: 20px;
  width: 36px;
  height: 36px;
  color: #d9def2;
  font-size: 30px;
  line-height: 32px;
  background: rgba(16, 28, 52, 0.4);
  border-radius: 50%;
}

.brand {
  color: #f4f0e8;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
}

.title {
  color: #aeb8d4;
  font-size: 14px;
}

.carousel {
  width: 100%;
  margin-top: 52px;
  white-space: nowrap;
}

.carousel-track {
  display: inline-flex;
  gap: 16px;
  padding-right: 24px;
}

.protocol-card {
  display: inline-flex;
  flex-direction: column;
  width: 230px;
  min-height: 300px;
  padding: 24px;
  border: 1px solid rgba(212, 224, 255, 0.14);
  border-radius: 8px;
  background:
    radial-gradient(circle at 50% 24%, rgba(169, 137, 255, 0.18), transparent 30%),
    rgba(12, 22, 42, 0.72);
  box-sizing: border-box;
  white-space: normal;
}

.protocol-card--active {
  border-color: rgba(199, 184, 255, 0.68);
  box-shadow: 0 18px 48px rgba(117, 96, 210, 0.18);
}

.icon-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 82px;
  height: 82px;
  margin-bottom: 34px;
  border-radius: 50%;
  background: rgba(167, 156, 255, 0.16);
}

.icon-text {
  color: #c7b8ff;
  font-size: 28px;
}

.protocol-title {
  color: #f5f1ea;
  font-size: 24px;
  font-weight: 600;
}

.protocol-meta {
  margin-top: 10px;
  color: #c9d4ea;
  font-size: 15px;
}

.protocol-note {
  margin-top: 8px;
  color: #b9a9ff;
  font-size: 14px;
}

.confirm-button {
  position: fixed;
  right: 24px;
  bottom: 38px;
  left: 24px;
  height: 54px;
  color: #08101f;
  font-size: 16px;
  line-height: 54px;
  background: linear-gradient(135deg, #fff2d8, #c7c9ff);
  border-radius: 999px;
}
</style>
