import { AuthService } from "@/api/services/auth/auth.service";
import GoogleCalendarConnectCard from "@/components/GoogleCalendarConnectCard";
import HomeLayout from "@/layouts/HomeLayout";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Home() {

    const queryClient = useQueryClient();

    const {data : CalendarStatus} = useQuery({
      queryKey: ["google-calendar", "status"],
      queryFn: AuthService.GoogleCalendarStatus,
      retry: false,
    });

    const connectCalendarMutation = useMutation({
      mutationFn: (code: string) =>
        AuthService.ConnectGoogleCalendar(code),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["google-calendar", "status"],
        });
      },
    });

    const googleLogin = useGoogleLogin({
      flow: "auth-code",
      scope: "https://www.googleapis.com/auth/calendar.events",

      onSuccess: ({ code }) => {
        connectCalendarMutation.mutate(code);
      },

      onError: () => {
        console.error("Falha na autorização do Google Calendar.");
      },
    });





    return (
        <HomeLayout>
            <section className="flex w-full flex-col items-center gap-6">
                <GoogleCalendarConnectCard
                    title="Conecte seu Google Agenda"
                    description="Sincronize seus eventos com o Google Calendar."
                    connectGoogleCalendar={googleLogin}
                    isConnected={CalendarStatus ? CalendarStatus.connected : false}
                />
            </section>
        </HomeLayout>
    );
}
