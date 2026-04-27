import type {
  ProtocolResolution,
  SessionSummary,
  SleepProtocol,
  SleepShellState,
} from '../types/protocol'

export const PRIMARY_PROTOCOL_ID = 'drift01'

export const DRIFT_PROTOCOLS: SleepProtocol[] = [
  {
    id: 'drift01',
    aliases: ['drift-01', 'drift_01'],
    title: 'Drift 01',
    mixLabel: 'Brown Noise + Ocean',
    durationMinutes: 30,
    fadeLabel: 'Auto Fade Out',
    status: 'active',
    audioTrackId: 'fireplace-001',
    visibleInSwitcher: true,
  },
  {
    id: 'drift_deep',
    aliases: ['driftdeep', 'drift-deep'],
    title: 'Drift Deep',
    mixLabel: 'Deep Noise + Slow Tide',
    durationMinutes: 30,
    fadeLabel: 'Auto Fade Out',
    status: 'active',
    audioTrackId: 'fireplace-001',
    visibleInSwitcher: true,
  },
  {
    id: 'ocean_calm',
    aliases: ['oceancalm', 'ocean-calm'],
    title: 'Ocean Calm',
    mixLabel: 'Brown Noise + Ocean',
    durationMinutes: 30,
    fadeLabel: 'Auto Fade Out',
    status: 'active',
    audioTrackId: 'fireplace-001',
    visibleInSwitcher: false,
  },
  {
    id: 'rain_night',
    aliases: ['rainnight', 'rain-night'],
    title: 'Rain Night',
    mixLabel: 'Pink Noise + Night Rain',
    durationMinutes: 30,
    fadeLabel: 'Auto Fade Out',
    status: 'active',
    audioTrackId: 'fireplace-001',
    visibleInSwitcher: false,
  },
]

export const SLEEP_SHELL_STATE: SleepShellState = {
  connected: false,
  label: 'Sleep Shell not connected',
}

export function getPrimaryProtocol(): SleepProtocol {
  return getProtocolById(PRIMARY_PROTOCOL_ID) ?? DRIFT_PROTOCOLS[0]
}

export function getVisibleProtocols(): SleepProtocol[] {
  return DRIFT_PROTOCOLS.filter((protocol) => protocol.visibleInSwitcher)
}

export function getProtocolById(protocolId: string | undefined): SleepProtocol | undefined {
  if (!protocolId) {
    return undefined
  }

  const normalized = normalizeProtocolId(protocolId)
  return DRIFT_PROTOCOLS.find((protocol) => {
    const ids = [protocol.id, ...protocol.aliases]
    return ids.some((id) => normalizeProtocolId(id) === normalized)
  })
}

export function resolveProtocolForEntry(
  requestedProtocolId: string | undefined,
  defaultProtocolId: string | undefined,
): ProtocolResolution {
  const requested = getProtocolById(requestedProtocolId)
  if (requested) {
    return {
      protocol: requested,
      requestedProtocolId,
      matched: true,
      fallbackReason: 'matched',
    }
  }

  const userDefault = getProtocolById(defaultProtocolId)
  if (userDefault) {
    return {
      protocol: userDefault,
      requestedProtocolId,
      matched: false,
      fallbackReason: 'default',
    }
  }

  return {
    protocol: getPrimaryProtocol(),
    requestedProtocolId,
    matched: false,
    fallbackReason: 'primary',
  }
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

function normalizeProtocolId(protocolId: string): string {
  return protocolId.trim().toLowerCase().replace(/[-\s]/g, '_')
}

function isPreviousDate(previousDate: string, currentDate: string): boolean {
  const previous = new Date(`${previousDate}T00:00:00`)
  const current = new Date(`${currentDate}T00:00:00`)
  const oneDay = 24 * 60 * 60 * 1000
  return current.getTime() - previous.getTime() === oneDay
}
