# Content Sourcing Plan

## Goal

Build the first real batch of 10 commercially usable sleep-focused tracks for `sleep-noise`, with enough rights evidence to survive product review and future growth.

## Working Rule

We separate this into two jobs:

- Codex prepares the target list, metadata shape, and intake rules.
- The project owner downloads the actual source files with their own platform account and keeps the rights evidence.

This split keeps the copyright trail attached to the real downloading account.

## First Batch

The first batch should stay narrow and sleep-first:

1. 窗边细雨
2. 夜雨白噪音
3. 轻柔海浪
4. 深夜潮汐
5. 森林夜息
6. 清晨林间
7. 轻风过林
8. 壁炉火焰
9. 溪流缓响
10. 冥想音钵

Recommended category mix:

- Rain: 2
- Ocean: 2
- Forest: 2
- Wind: 1
- Fire: 1
- Stream: 1
- Meditation: 1

## Sourcing Rules

Use these filters before accepting any asset:

- Must allow commercial use.
- Prefer CC0 or explicit commercial-use permission.
- Avoid non-commercial licenses.
- Avoid assets that require unclear downstream attribution.
- Prefer 15-60 minutes or loop-friendly 10-30 minute material.
- Avoid sudden peaks, speech, music melody, harsh birds, strong thunder, alarms, or traffic horns.
- Prefer stable texture that can run under sleep conditions for a long time.

## Evidence To Keep

For every accepted asset, keep all of these:

- Source page URL
- Source page screenshot
- License or rights screenshot
- Download date
- Downloading account used
- Raw file name
- Processed file name
- Final cover image source

## Suggested Folder Layout

Store raw and processed assets like this:

```text
sleep-noise/
  assets/
    raw-audio/
    processed-audio/
    covers/
    rights-evidence/
      rain-window-001/
      rain-night-002/
      ...
```

Inside each rights evidence folder keep:

- source-page.png
- license-page.png
- notes.txt

## Processing Checklist

Before a track enters the app:

- Trim obvious dead air
- Normalize playback volume
- Remove harsh spikes if needed
- Verify a clean loop point
- Export compressed delivery file
- Confirm final duration in manifest

## Current Project Files

- Candidate manifest: [audio-manifest.json](D:/控糖APP/sleep-noise/content/audio-manifest.json)
- Rights ledger: [copyright-ledger.csv](D:/控糖APP/sleep-noise/content/copyright-ledger.csv)
- Intake template: [first-batch-sourcing-template.csv](D:/控糖APP/sleep-noise/content/first-batch-sourcing-template.csv)

## Next Step

Fill `first-batch-sourcing-template.csv` with real download results for the first 10 assets, then replace the example CDN URLs in `audio-manifest.json` with real hosted files.

