import type { EventType } from "@/enums/EventType";
import type { RecurrenceFrequency } from "@/enums/RecurrenceFrequency";

export type CreateEventRequest = {
    title: string;
    description?: string;
    eventType: EventType;
    startDate: string;
    endDate: string;
    recurrency?: {
        frequency: RecurrenceFrequency;
        interval: number;
        daysOfWeek?: string[];
        count?: number;
        until?: string;
    };
}
