import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    CalendarDays,
    CheckCircle2,
    CircleAlert,
    Clock3,
    ExternalLink,
    RefreshCw,
} from "lucide-react";

import type { EventResponse } from "@/api/@types/Events/EventResponse";
import { EventSyncStatus } from "@/enums/EventSyncStatus";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type EventCardItemProps = {
    event: EventResponse;
};

const syncStatusConfig = {
    [EventSyncStatus.Created]: {
        label: "Criado localmente",
        className: "bg-muted text-muted-foreground",
        icon: CalendarDays,
    },
    [EventSyncStatus.Syncing]: {
        label: "Sincronizando",
        className: "bg-yellow-100 text-yellow-800",
        icon: RefreshCw,
    },
    [EventSyncStatus.Synced]: {
        label: "Sincronizado",
        className: "bg-green-100 text-green-800",
        icon: CheckCircle2,
    },
    [EventSyncStatus.SyncFailed]: {
        label: "Falha na sincronização",
        className: "bg-red-100 text-red-800",
        icon: CircleAlert,
    },
} as const;

function formatEventDate(value: string) {
    return format(new Date(value), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export default function EventCardItem({ event }: EventCardItemProps) {
    const status = syncStatusConfig[event.syncStatus];
    const StatusIcon = status.icon;

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <CardTitle className="truncate">{event.title}</CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-1">
                            <Clock3 className="size-4" />
                            {formatEventDate(event.dateStart)}
                        </CardDescription>
                    </div>

                    <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.className}`}
                    >
                        <StatusIcon className="size-3.5" />
                        {status.label}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                    {event.description || "Sem descrição"}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                        Até {formatEventDate(event.dateEnd)}
                    </span>

                    {event.googleHtmlLink && (
                        <a
                            href={event.googleHtmlLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                            Ver no Google Calendar
                            <ExternalLink className="size-4" />
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
