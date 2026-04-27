<template>
  <view class="page history">
    <view class="header">
      <text class="eyebrow">记录</text>
      <text class="title">助眠记录</text>
      <text class="subtitle">记录每一次陪你入睡的夜晚</text>
    </view>

    <view class="stats">
      <view class="stat stat--primary">
        <text class="stat-value">{{ summary.consecutiveNights }}</text>
        <text class="stat-label">连续助眠次数</text>
      </view>

      <view class="stat">
        <text class="stat-value">{{ summary.sessionCount }}</text>
        <text class="stat-label">助眠总次数</text>
      </view>
    </view>

    <view class="last-card">
      <text class="last-label">最近一次助眠</text>
      <text class="last-value">{{ lastSession }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { formatLastSessionDate } from '../../services/protocol-service'
import { getSessionSummary } from '../../services/storage-service'

const summary = ref(getSessionSummary())
const lastSession = computed(() => formatLastSessionDate(summary.value))

onShow(() => {
  summary.value = getSessionSummary()
})
</script>

<style scoped lang="scss">
.history {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 34px;
}

.eyebrow {
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
  max-width: 270px;
  color: #aeb8d4;
  font-size: 14px;
  line-height: 21px;
}

.stats {
  display: flex;
  gap: 12px;
}

.stat,
.last-card {
  padding: 18px;
  border: 1px solid rgba(212, 224, 255, 0.14);
  border-radius: 8px;
  background: rgba(15, 25, 48, 0.68);
}

.stat {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
}

.stat--primary {
  background: rgba(33, 46, 82, 0.78);
}

.stat-value {
  color: #f7f0e6;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 46px;
  line-height: 50px;
}

.stat-label,
.last-label {
  color: #9ea8d8;
  font-size: 13px;
}

.last-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.last-value {
  color: #f5f1ea;
  font-size: 18px;
}
</style>
