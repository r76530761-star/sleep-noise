export interface NfcEntryEvent {
  source: 'nfc'
  protocolId: string | undefined
  resolvedProtocolId: string
  matched: boolean
  fallbackReason: 'matched' | 'default' | 'primary'
  createdAt: string
}
