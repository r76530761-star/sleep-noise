# Drift Ritual Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the mini program as a mobile-first Drift sleep ritual prototype centered on one 30-minute Sleep Descent session.

**Architecture:** Keep the existing uni-app/Vue/Pinia foundation and reuse the audio service as the playback boundary. Replace the content-library information architecture with three tabs: Tonight, History, and Settings, backed by a small protocol model that can later grow into additional Drift sessions or Sleep Shell hardware entry.

**Tech Stack:** uni-app, Vue 3, TypeScript, Pinia, WeChat Mini Program build.

---

### Task 1: Navigation and Product Shell

**Files:**
- Modify: `src/pages.json`
- Modify: `src/manifest.json`
- Modify: `src/styles/tokens.scss`
- Modify: `src/styles/global.scss`

- [ ] **Step 1: Rewrite the routes to three tabs**

Use `pages/home/index`, `pages/history/index`, and `pages/settings/index`. Keep old pages on disk but remove them from tab navigation.

- [ ] **Step 2: Rename the app surface to Drift**

Set the navigation title and manifest name to `Drift`. Use a black/deep-navy background.

- [ ] **Step 3: Update shared styling tokens**

Use a restrained night palette with moonlight accent, glass surfaces, and stable mobile spacing.

- [ ] **Step 4: Run the WeChat build**

Run: `npm.cmd --prefix "D:\控糖APP\sleep-noise" run build:mp-weixin`

Expected: build completes and outputs `dist\build\mp-weixin`.

### Task 2: Drift Protocol Model and Session History

**Files:**
- Create: `src/types/protocol.ts`
- Create: `src/services/protocol-service.ts`
- Modify: `src/services/storage-service.ts`
- Create: `tests/services/protocol-service.test.ts`

- [ ] **Step 1: Add one protocol card**

Create `Drift 01` with duration `30`, mix label `Brown Noise + Ocean`, and fade label `Auto Fade Out`.

- [ ] **Step 2: Reserve future expansion**

Include an inactive `Drift 02` option and a Sleep Shell connected-state placeholder, without exposing a content library.

- [ ] **Step 3: Add local session counters**

Store total sessions, consecutive nights, and last session date in local storage.

- [ ] **Step 4: Test protocol and session summary**

Verify the default protocol, alternate protocol placeholder, and session summary values.

### Task 3: Tonight Page

**Files:**
- Modify: `src/pages/home/index.vue`

- [ ] **Step 1: Replace the library UI**

Build a 9:16 mobile-first ritual screen with title `Sleep Descent`, subtitle, central circular `30:00` timer, one primary start button, and one protocol card.

- [ ] **Step 2: Wire the start action**

Use the current player store to play the demo audio. Record one local session start for History.

- [ ] **Step 3: Keep controls minimal**

Do not add previous/next/library controls. Use one quiet stop/pause state only if the existing service reports playback.

### Task 4: History and Settings

**Files:**
- Create: `src/pages/history/index.vue`
- Modify: `src/pages/settings/index.vue`

- [ ] **Step 1: Add minimal History**

Show consecutive nights, session count, and last ritual date.

- [ ] **Step 2: Simplify Settings**

Show Timer, Sound Mix placeholder, Notifications placeholder, Sleep Shell reserved state, and legal/support actions.

### Task 5: Verification and Commit

**Files:**
- Test: `tests/services/protocol-service.test.ts`

- [ ] **Step 1: Run tests**

Run: `Push-Location "D:\控糖APP\sleep-noise"; npm.cmd run test; Pop-Location`

Expected: all tests pass.

- [ ] **Step 2: Run WeChat build**

Run: `npm.cmd --prefix "D:\控糖APP\sleep-noise" run build:mp-weixin`

Expected: build completes.

- [ ] **Step 3: Commit and push**

Commit message: `feat: reshape app as Drift sleep ritual`
