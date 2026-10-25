import type { AuthmeResponse } from "@/api/@types/Auth/AuthMeResponse";
import type { GoogleCalendarStatusResponse } from "@/api/@types/Auth/GoogleCalendarStatusResponse";
import type { AuthRequest } from "@/api/@types/Auth/AuthRequest";
import type { AuthResponse } from "@/api/@types/Auth/AuthResponse";
import type { ApiGlobalResponse } from "@/api/@types/Global/ApiGlobalResponse";
import { env } from "@/env/env";
import { getDeviceInformation } from "@/utils/GetDeviceInformation";

export class AuthService {
    static async LoginGoogle(
        authRequest: AuthRequest
    ): Promise<ApiGlobalResponse<AuthResponse>> {
        const deviceData = await getDeviceInformation();
        authRequest.DeviceId = deviceData?.deviceId;
        authRequest.DeviceInfo = `${deviceData?.platform} - ${deviceData?.screenResolution[0]}x${deviceData?.screenResolution[1]} - ${deviceData?.languages.join(", ")}`;

        const request = await fetch(`${env.VITE_API_BASE_URL}/Auth/google`, {
            method: "POST",
            body: JSON.stringify(authRequest),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        return await request.json() as ApiGlobalResponse<AuthResponse>;
    }

    static async AuthMe(): Promise<AuthmeResponse | null> {
        const request = await fetch(`${env.VITE_API_BASE_URL}/Auth/me`, {
            method: "GET",
            credentials: "include"
        });

        if (!request.ok) {
            return null;
        }

        const response = await request.json() as ApiGlobalResponse<AuthmeResponse>;

        return response.success ? response.data : null;
    }

    static async ConnectGoogleCalendar(
        code: string
    ): Promise<GoogleCalendarStatusResponse | null> {
        const request = await fetch(`${env.VITE_API_BASE_URL}/Auth/google-calendar/connect`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ code })
        });

        const response = await request.json() as ApiGlobalResponse<GoogleCalendarStatusResponse>;

        if (!request.ok || !response.success) {
            throw new Error(
                response.error?.message
                ?? "Não foi possível conectar o Google Calendar."
            );
        }

        return response.data;
    }

    static async GoogleCalendarStatus(): Promise<GoogleCalendarStatusResponse | null> {
        const request = await fetch(`${env.VITE_API_BASE_URL}/Auth/google-calendar/status`, {
            method: "GET",
            credentials: "include"
        });

        if (!request.ok) {
            return null;
        }

        const response = await request.json() as ApiGlobalResponse<GoogleCalendarStatusResponse>;

        return response.success ? response.data : null;
    }
}
