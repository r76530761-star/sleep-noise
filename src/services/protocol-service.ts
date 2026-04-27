import type { SessionSummary, SleepProtocol, SleepShellState } from '../types/protocol'

export const DRIFT_PROTOCOLS: SleepProtocol[] = [
  {
    id: 'drift-01',
    title: 'Drift 01',
    mixLabel: 'Brown Noise + Ocean',
    durationMinutes: 30,
    fadeLabel: 'Auto Fade Out',
    status: 'active',
    audioTrackId: 'fireplace-001',
  },
  {
    id: 'drift-02',
    title: 'Drift 02',
    mixLabel: 'Deep Noise + Slow Tide',
    durationMinutes: 30,
    fadeLabel: 'Reserved',
    status: 'reserved',
    audioTrackId: 'fireplace-001',
  },
]

export const SLEEP_SHELL_STATE: SleepShellState = {
  connected: false,
  label: 'Sleep Shell not connected',
}

export function getPrimaryProtocol(): SleepProtocol {
  return DRIFT_PROTOCOLS[0]
}

export function getProtocolById(protocolId: string): SleepProtocol | undefined {
  return DRIFT_PROTOCOLS.find((protocol) => protocol.id === protocolId)
}

export function formatLastSessionDate(summary: SessionSummary): string {
  return summary.lastSessionDate ?? 'No sessions yet'
}

export function calculateNextSessionSummary(
  previous: SessionSummary,
  sessionDate: string,
): SessionSummary {
  if (!previous.lastSessionDate) {
    return {
      consecutiveNights: 1,
      sessionCount: previous.sessionCount + 1,
      lastSessionDate: sessionDate,
    }
  }

  if (previous.lastSessionDate === sessionDate) {
    return {
      ...previous,
      sessionCount: previous.sessionCount + 1,
    }
  }

  const nextConsecutiveNights = isPreviousDate(previous.lastSessionDate, sessionDate)
    ? previous.consecutiveNights + 1
    : 1

  return {
    consecutiveNights: nextConsecutiveNights,
    sessionCount: previous.sessionCount + 1,
    lastSessionDate: sessionDate,
  }
}

export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isPreviousDate(previousDate: string, currentDate: string): boolean {
  const previous = new Date(`${previousDate}T00:00:00`)
  const current = new Date(`${currentDate}T00:00:00`)
  const oneDay = 24 * 60 * 60 * 1000
  return current.getTime() - previous.getTime() === oneDay
}
