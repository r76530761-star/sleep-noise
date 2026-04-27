import type { NfcEntryEvent } from '../types/analytics'
import type { ProtocolResolution } from '../types/protocol'

const NFC_ENTRY_EVENTS_KEY = 'drift:analytics:nfc-entry-events'
const MAX_STORED_EVENTS = 50

export function trackNfcEntry(
  source: string | undefined,
  resolution: ProtocolResolution,
  now = new Date(),
): NfcEntryEvent | undefined {
  if (source !== 'nfc') {
    return undefined
  }

  const event: NfcEntryEvent = {
    source: 'nfc',
    protocolId: resolution.requestedProtocolId,
    resolvedProtocolId: resolution.protocol.id,
    matched: resolution.matched,
    fallbackReason: resolution.fallbackReason,
    createdAt: now.toISOString(),
  }

  const next = [event, ...getNfcEntryEvents()].slice(0, MAX_STORED_EVENTS)
  uni.setStorageSync(NFC_ENTRY_EVENTS_KEY, next)
  return event
}

export function getNfcEntryEvents(): NfcEntryEvent[] {
  const value = uni.getStorageSync(NFC_ENTRY_EVENTS_KEY)
  return Array.isArray(value) ? value.filter(isNfcEntryEvent) : []
}

function isNfcEntryEvent(value: unknown): value is NfcEntryEvent {
  if (!value || typeof value !== 'object') {
    return false
  }

  const event = value as Partial<NfcEntryEvent>
  return (
    event.source === 'nfc'
    && typeof event.resolvedProtocolId === 'string'
    && typeof event.matched === 'boolean'
    && (
      event.fallbackReason === 'matched'
      || event.fallbackReason === 'default'
      || event.fallbackReason === 'primary'
    )
    && typeof event.createdAt === 'string'
  )
}
