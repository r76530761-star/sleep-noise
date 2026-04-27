<template>
  <view class="page settings">
    <view class="header">
      <text class="eyebrow">Settings</text>
      <text class="title">Drift</text>
      <text class="subtitle">Keep the ritual simple.</text>
    </view>

    <view class="group">
      <view class="row">
        <view class="row-copy">
          <text class="row-title">Timer</text>
          <text class="row-caption">30 minutes</text>
        </view>
        <text class="row-status">fixed</text>
      </view>

      <view class="row">
        <view class="row-copy">
          <text class="row-title">Sound Mix</text>
          <text class="row-caption">Protocol audio controls the fade</text>
        </view>
        <text class="row-status">soon</text>
      </view>

      <view class="row">
        <view class="row-copy">
          <text class="row-title">Notifications</text>
          <text class="row-caption">Evening ritual reminder</text>
        </view>
        <text class="row-status">soon</text>
      </view>
    </view>

    <view class="shell-card">
      <text class="shell-kicker">Sleep Shell</text>
      <text class="shell-title">{{ shell.label }}</text>
      <text class="shell-caption">Reserved for future NFC hardware entry.</text>
    </view>

    <view class="group">
      <button class="link-row" @tap="openDocument('privacy')">Privacy</button>
      <button class="link-row" @tap="openDocument('terms')">Terms</button>
      <button class="link-row" @tap="openDocument('copyright')">Audio Rights</button>
      <button class="link-row" open-type="feedback">Feedback</button>
    </view>

    <text class="version">Prototype 0.2.0</text>
  </view>
</template>

<script setup lang="ts">
import { SLEEP_SHELL_STATE } from '../../services/protocol-service'

const shell = SLEEP_SHELL_STATE

function openDocument(type: 'privacy' | 'terms' | 'copyright'): void {
  const titleMap = {
    privacy: 'Privacy',
    terms: 'Terms',
    copyright: 'Audio Rights',
  }

  uni.showModal({
    title: titleMap[type],
    content: 'This document will be finalized before submission.',
    showCancel: false,
  })
}
</script>

<style scoped lang="scss">
.settings {
  display: grid;
  align-content: start;
  gap: 22px;
}

.header {
  display: grid;
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
  color: #aeb8d4;
  font-size: 14px;
}

.group {
  display: grid;
  gap: 10px;
}

.row,
.shell-card,
.link-row {
  border: 1px solid rgba(212, 224, 255, 0.14);
  border-radius: 8px;
  background: rgba(15, 25, 48, 0.68);
}

.row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 15px;
}

.row-copy {
  display: grid;
  gap: 4px;
}

.row-title {
  color: #f5f1ea;
  font-size: 15px;
}

.row-caption,
.shell-caption {
  color: #8f9bb8;
  font-size: 12px;
  line-height: 18px;
}

.row-status {
  color: #c7b8ff;
  font-size: 12px;
}

.shell-card {
  display: grid;
  gap: 7px;
  padding: 18px;
  background: rgba(33, 46, 82, 0.58);
}

.shell-kicker {
  color: #c7b8ff;
  font-size: 12px;
}

.shell-title {
  color: #f5f1ea;
  font-size: 18px;
}

.link-row {
  height: 46px;
  padding: 0 16px;
  color: #f5f1ea;
  font-size: 14px;
  line-height: 46px;
  text-align: left;
}

.version {
  color: #73809c;
  font-size: 12px;
  text-align: center;
}
</style>
