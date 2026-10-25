
import type { CreateEventRequest } from "@/api/@types/Events/CreateEventRequest";
import type { CreateEventResponse } from "@/api/@types/Events/CreateEventResponse";
import type { EventResponse } from "@/api/@types/Events/EventResponse";
import type { EventsFilterRequest } from "@/api/@types/Events/EventsFilterRequest";
import type { ApiGlobalResponse } from "@/api/@types/Global/ApiGlobalResponse";
import { env } from "@/env/env";

export class EventService {
    static async CreateEvent(
        event: CreateEventRequest
    ): Promise<ApiGlobalResponse<CreateEventResponse>> {
        const request = await fetch(`${env.VITE_API_BASE_URL}/Event/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(event)
        });

        const response = await request.json() as ApiGlobalResponse<CreateEventResponse>;

        if (!request.ok || !response.success) {
            throw new Error(
                response.error?.message
                ?? "Não foi possível criar o evento."
            );
        }

        return response;
    }

    static async ListEvents(
        filters: EventsFilterRequest = {}
    ): Promise<ApiGlobalResponse<EventResponse[]>> {
        const params = new URLSearchParams();

        if (filters.title) {
            params.set("title", filters.title);
        }

        if (filters.startDate) {
            params.set("startDate", filters.startDate.toISOString());
        }

        if (filters.endDate) {
            params.set("endDate", filters.endDate.toISOString());
        }

        const queryString = params.toString();

        const request = await fetch(
            `${env.VITE_API_BASE_URL}/Event${queryString ? `?${queryString}` : ""}`,
            {
                method: "GET",
                credentials: "include",
            }
        );

        const response = await request.json() as ApiGlobalResponse<EventResponse[]>;

        if (!request.ok || !response.success) {
            throw new Error(
                response.error?.message
                ?? "Não foi possível listar os eventos."
            );
        }

        return response;
    }
}
