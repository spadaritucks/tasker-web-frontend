import type { EventSyncStatus } from "@/enums/EventSyncStatus"
import type { EventType } from "@/enums/EventType"

export type EventResponse = {
    id: string;
    userId: string;
    googleEventId: string | null;
    title: string;
    description: string | null;
    dateStart: string;
    dateEnd: string;
    googleHtmlLink: string | null;
    syncStatus: EventSyncStatus;
    createdAt: string;
    eventType: EventType;
}
