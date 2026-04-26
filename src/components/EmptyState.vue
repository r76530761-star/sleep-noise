<template>
  <view class="empty">
    <text>{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<style scoped lang="scss">
.empty {
  padding: 28px 16px;
  color: #aeb7c2;
  text-align: center;
  background: #171d24;
  border-radius: 8px;
}
</style>
