import { Search } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import NotificationIcon from "@/assets/notification.png";
import DynamicHoneBreadcrumb from "@/components/DynamicHomeBreadcrumb";
import { useLocation, Navigate } from "react-router-dom";
import { AuthService } from "@/api/services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";

export default function HomeLayout({ children }: { children: React.ReactNode }) {

  const location = useLocation();



  const {data : profile, isLoading : isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn : async () => {
      const profile = await AuthService.AuthMe()
      return profile
    },
    retry: false,
    staleTime: 5 * 60 * 1000
  })
  
  if (isLoadingProfile) {
      return <Spinner />;
  }

  if (!profile || !profile.authenticated) {
      return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar user={profile.user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger className="-ml-2" />

          <DynamicHoneBreadcrumb pathName={location.pathname.substring(1) || "home"} />

          <div className="relative ml-auto w-full max-w-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Busca de tarefas"
              aria-label="Busca de tarefas"
              className="h-9 w-full bg-input/30 pl-9"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Notificações"
            className="shrink-0 rounded-full"
          >
            <img
              src={NotificationIcon}
              alt=""
              aria-hidden="true"
              className="size-5 object-contain"
            />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Perfil do usuário"
            className="rounded-full p-0"
          >
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="Avatar do usuário"
              />
              <AvatarFallback>TS</AvatarFallback>
            </Avatar>
          </Button>
        </header>

        <main className="flex flex-1 flex-col bg-background p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
