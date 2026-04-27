import { describe, expect, it } from 'vitest'
import {
  DRIFT_PROTOCOLS,
  calculateNextSessionSummary,
  formatLastSessionDate,
  getPrimaryProtocol,
  getProtocolById,
  resolveProtocolForEntry,
  toLocalDateKey,
} from '../../src/services/protocol-service'

describe('protocol-service', () => {
  it('exposes drift01 as the primary protocol', () => {
    expect(getPrimaryProtocol()).toMatchObject({
      id: 'drift01',
      title: 'Drift',
      mixLabel: 'Pink Noise + Ocean',
      localizedMixLabel: '粉噪 + 海浪',
      durationMinutes: 30,
      fadeLabel: 'Auto Fade Out',
      localizedFadeLabel: '自动渐隐',
      status: 'active',
    })
  })

  it('matches NFC protocol ids and aliases from the reusable config list', () => {
    expect(getProtocolById('drift01')?.id).toBe('drift01')
    expect(getProtocolById('drift-01')?.id).toBe('drift01')
    expect(getProtocolById('drift_deep')?.id).toBe('drift_deep')
    expect(getProtocolById('ocean_calm')?.id).toBe('calm_drift')
    expect(getProtocolById('calm_drift')?.id).toBe('calm_drift')
    expect(getProtocolById('rain_night')?.id).toBe('rain_night')
  })

  it('falls back to user default before primary protocol', () => {
    const resolution = resolveProtocolForEntry('missing-protocol', 'rain_night')

    expect(resolution).toMatchObject({
      matched: false,
      fallbackReason: 'default',
    })
    expect(resolution.protocol.id).toBe('rain_night')
  })

  it('falls back to drift01 when request and default are unavailable', () => {
    const resolution = resolveProtocolForEntry('missing-protocol', undefined)

    expect(resolution).toMatchObject({
      matched: false,
      fallbackReason: 'primary',
    })
    expect(resolution.protocol.id).toBe('drift01')
  })

  it('keeps future protocols in config instead of page logic', () => {
    expect(DRIFT_PROTOCOLS.map((protocol) => protocol.id)).toEqual([
      'drift01',
      'drift_deep',
      'rain_night',
      'calm_drift',
    ])
  })

  it('increments consecutive nights only across adjacent dates', () => {
    const first = calculateNextSessionSummary(
      { consecutiveNights: 0, sessionCount: 0, lastSessionDate: undefined },
      '2026-04-26',
    )
    const second = calculateNextSessionSummary(first, '2026-04-27')
    const missedNight = calculateNextSessionSummary(second, '2026-04-29')

    expect(first).toEqual({
      consecutiveNights: 1,
      sessionCount: 1,
      lastSessionDate: '2026-04-26',
    })
    expect(second.consecutiveNights).toBe(2)
    expect(missedNight.consecutiveNights).toBe(1)
  })

  it('formats empty last session state', () => {
    expect(formatLastSessionDate({
      consecutiveNights: 0,
      sessionCount: 0,
      lastSessionDate: undefined,
    })).toBe('No sessions yet')
  })

  it('formats local dates as stable keys', () => {
    expect(toLocalDateKey(new Date(2026, 3, 27))).toBe('2026-04-27')
  })
})
