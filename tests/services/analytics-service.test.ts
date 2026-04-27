import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getNfcEntryEvents, trackNfcEntry } from '../../src/services/analytics-service'
import { resolveProtocolForEntry } from '../../src/services/protocol-service'

const memory = new Map<string, unknown>()

vi.stubGlobal('uni', {
  getStorageSync: (key: string) => memory.get(key),
  setStorageSync: (key: string, value: unknown) => memory.set(key, value),
})

describe('analytics-service', () => {
  beforeEach(() => {
    memory.clear()
  })

  it('tracks NFC source and requested protocol id', () => {
    const resolution = resolveProtocolForEntry('rain_night', undefined)
    const event = trackNfcEntry('nfc', resolution, new Date('2026-04-27T12:00:00.000Z'))

    expect(event).toEqual({
      source: 'nfc',
      protocolId: 'rain_night',
      resolvedProtocolId: 'rain_night',
      matched: true,
      fallbackReason: 'matched',
      createdAt: '2026-04-27T12:00:00.000Z',
    })
    expect(getNfcEntryEvents()).toHaveLength(1)
  })

  it('does not track non-NFC entries', () => {
    const resolution = resolveProtocolForEntry('drift01', undefined)

    expect(trackNfcEntry(undefined, resolution)).toBeUndefined()
    expect(getNfcEntryEvents()).toEqual([])
  })
})
