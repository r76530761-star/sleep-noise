<template>
  <view class="ad-slot">
    <ad v-if="unitId" :unit-id="unitId" />
  </view>
</template>

<script setup lang="ts">
defineProps<{
  unitId?: string
}>()
</script>

<style scoped lang="scss">
.ad-slot {
  min-height: 72px;
}
</style>
