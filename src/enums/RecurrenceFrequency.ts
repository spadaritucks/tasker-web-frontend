export const RecurrenceFrequency = {
    Daily: 0,
    Weekly: 1,
    Monthly: 2,
    Yearly: 3,
} as const;

export type RecurrenceFrequency =
    typeof RecurrenceFrequency[keyof typeof RecurrenceFrequency];
