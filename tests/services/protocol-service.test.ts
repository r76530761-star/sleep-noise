import { describe, expect, it } from 'vitest'
import {
  DRIFT_PROTOCOLS,
  calculateNextSessionSummary,
  formatLastSessionDate,
  getPrimaryProtocol,
  toLocalDateKey,
} from '../../src/services/protocol-service'

describe('protocol-service', () => {
  it('exposes Drift 01 as the primary protocol', () => {
    expect(getPrimaryProtocol()).toMatchObject({
      id: 'drift-01',
      title: 'Drift 01',
      mixLabel: 'Brown Noise + Ocean',
      durationMinutes: 30,
      fadeLabel: 'Auto Fade Out',
      status: 'active',
    })
  })

  it('keeps Drift 02 as a reserved protocol placeholder', () => {
    expect(DRIFT_PROTOCOLS[1]).toMatchObject({
      id: 'drift-02',
      status: 'reserved',
    })
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
