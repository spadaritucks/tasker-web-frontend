export const EventSyncStatus = {
    Created : 0,
    Syncing : 1,
    Synced : 2,
    SyncFailed : 3
} as const

export type EventSyncStatus = typeof EventSyncStatus[keyof typeof EventSyncStatus];