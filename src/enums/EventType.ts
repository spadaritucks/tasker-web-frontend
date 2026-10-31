export const EventType = {
    Timed: 0,
    AllDay: 1,
    Range: 2,
    Recurring: 3,
} as const;

export type EventType = typeof EventType[keyof typeof EventType];
