import { useState } from "react";
import DatePicker from "@/components/DatePicker";
import GlobalFieldInput from "@/components/GlobalFieldInput";
import { Button } from "@/components/ui/button";
import HomeLayout from "@/layouts/HomeLayout";
import { useQuery } from "@tanstack/react-query";
import { EventService } from "@/api/services/events/event.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import EventCardItem from "@/components/EventCardItem/EventCardItem";

export default function EventsPage() {

    const Navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [title, setTitle] = useState(
        () => searchParams.get("title") ?? ""
    );
    const [startDate, setStartDate] = useState<Date | undefined>(() =>
        searchParams.get("startDate")
            ? new Date(searchParams.get("startDate")!)
            : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(() =>
        searchParams.get("endDate")
            ? new Date(searchParams.get("endDate")!)
            : undefined
    );

    const appliedFilters = {
        title: searchParams.get("title") ?? undefined,
        startDate: searchParams.get("startDate")
            ? new Date(searchParams.get("startDate")!)
            : undefined,
        endDate: searchParams.get("endDate")
            ? new Date(searchParams.get("endDate")!)
            : undefined,
    };

    function applyFilters() {
        const params = new URLSearchParams();

        if (title.trim()) {
            params.set("title", title.trim());
        }

        if (startDate) {
            params.set("startDate", startDate.toISOString());
        }

        if (endDate) {
            params.set("endDate", endDate.toISOString());
        }

        setSearchParams(params);
    }

    function clearFilters() {
        setTitle("");
        setStartDate(undefined);
        setEndDate(undefined);
        setSearchParams({});
    }

    const { data: EventsData, isLoading: isLoadingEvents } = useQuery({
        queryKey: [
            "events",
            "list",
            searchParams.toString(),
        ],
        queryFn: () => EventService.ListEvents(appliedFilters),
        retry: false,
    });

    return (
        <HomeLayout>
            <section className="w-full h-full flex flex-col items-start justify-start">
                <div className="w-full flex items-center justify-between p-4">
                    <div className="flex flex-col items-start justify-center">
                        <h2 className="text-2xl font-bold">Minhas Tarefas</h2>
                        <p className="text-gray-400">Organize tudo o que precisa ser feito.</p>
                    </div>
                    <Button variant="default" onClick={() => Navigate("/event/create", { replace: true })}>Nova Tarefa</Button>
                </div>
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="flex w-full max-w-5xl flex-row flex-wrap items-end gap-4 px-4 [&>[data-slot=field]]:min-w-56 [&>[data-slot=field]]:flex-1">
                        <GlobalFieldInput
                            label="Título"
                            placeholder="Aula de Inglês"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                        />
                        <DatePicker
                            id="event-start-date"
                            label="Data de início"
                            value={startDate}
                            onChange={setStartDate}
                        />
                        <DatePicker
                            id="event-end-date"
                            label="Data de término"
                            value={endDate}
                            onChange={setEndDate}
                        />
                        <div className="flex gap-2">
                            <Button type="button" onClick={applyFilters}>
                                Filtrar
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={clearFilters}
                            >
                                Limpar
                            </Button>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>

                <div className=" w-full max-w-5xl gap-4 p-4 flex flex-col items-center justify-start">
                    {isLoadingEvents ? (
                        <Spinner />
                    ) : EventsData?.data && EventsData.data.length > 0 ? (
                        EventsData.data.map((event) => (
                            <EventCardItem key={event.id} event={event} />
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Nenhum evento encontrado.
                        </p>
                    )}
                </div>
            </section>
        </HomeLayout>
    )
}
