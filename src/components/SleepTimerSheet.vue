<template>
  <view class="timer">
    <text class="label">定时关闭</text>
    <view class="options">
      <button
        v-for="option in options"
        :key="option"
        class="timer-button"
        @tap="$emit('select', option)"
      >
        {{ option }} 分钟
      </button>
      <button class="timer-button timer-button--ghost" @tap="$emit('cancel')">
        关闭
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { SLEEP_TIMER_OPTIONS, type SleepTimerMinutes } from '../services/timer-service'

const options = SLEEP_TIMER_OPTIONS

defineEmits<{
  select: [minutes: SleepTimerMinutes]
  cancel: []
}>()
</script>

<style scoped lang="scss">
.timer {
  padding: 14px;
  border-radius: 8px;
  background: #171d24;
}

.label {
  display: block;
  margin-bottom: 10px;
  color: #f4f0e8;
  font-size: 15px;
}

.options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.timer-button {
  height: 36px;
  padding: 0;
  color: #f4f0e8;
  font-size: 12px;
  line-height: 36px;
  background: #202833;
  border-radius: 8px;
}

.timer-button::after {
  border: 0;
}

.timer-button--ghost {
  color: #d6ad75;
}
</style>
