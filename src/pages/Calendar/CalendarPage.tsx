import CalendarComponent from "@/components/Calendar/CalendarComponent";
import EventCardItem from "@/components/EventCardItem/EventCardItem";
import HomeLayout from "@/layouts/HomeLayout";
import { useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { EventService } from "@/api/services/events/event.service";
import { Spinner } from "@/components/ui/spinner";

export default function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const { data: eventsData, isLoading: isLoadingEvents } = useQuery({
        queryKey: ["calendar-events", dayjs(selectedDate).format("YYYY-MM-DD")],
        queryFn: () => EventService.ListEvents({
            startDate: dayjs(selectedDate).startOf("day").toDate(),
            endDate: dayjs(selectedDate).endOf("day").toDate(),
        }),
    });

    return (
        <HomeLayout>
            <section className="flex h-full w-full flex-col gap-6">
                <div>
                    <h2 className="text-2xl font-bold">Calendário</h2>
                    <p className="text-gray-400">Acompanhe seus compromissos e eventos.</p>
                </div>

                <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                    <div className="rounded-4xl bg-card p-4 shadow-md ring-1 ring-foreground/5">
                        <CalendarComponent
                            selectedDate={selectedDate}
                            onDateSelected={setSelectedDate}
                            disableBlockedDates={false}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">
                                Eventos de {dayjs(selectedDate).format("DD/MM/YYYY")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Compromissos selecionados para este dia.
                            </p>
                        </div>

                        {isLoadingEvents ? (
                            <Spinner />
                        ) : eventsData?.data && eventsData.data.length > 0 ? (
                            eventsData.data.map((event) => (
                                <EventCardItem key={event.id} event={event} />
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Nenhum evento encontrado para este dia.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </HomeLayout>
    )
}
