import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import LogoTasker from "@/assets/logo-tasker.png";
import UserCard from "./UserCard";
import DashboardIcon from "@/assets/dashboard.png";
import CalendarIcon from "@/assets/calendar.png"
import CheckListIcon from "@/assets/check-list.png"
import InboxIcon from "@/assets/inbox.png"
import type { UserProfile } from "@/api/@types/Auth/AuthMeResponse";

interface AppSidebarProps {
    user? : UserProfile
}

export function AppSidebar({ user }: AppSidebarProps) {

    console.log(user)

    return (
        <Sidebar>
            <SidebarHeader className="flex flex-col justify-center items-center gap-2">
                <img src={LogoTasker} alt="Logo" />
                <UserCard profilePicture="https://via.placeholder.com/150" name={user?.name || "User"} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenuItem>
                        <SidebarMenuButton render={<a href="/home" />}>
                            <img src={DashboardIcon} alt="Visão Geral" className="w-6 h-6" />
                            <span>Visão Geral</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton render={<a href="/events" />}>
                            <img src={CheckListIcon} alt="Lista de Tarefas" className="w-6 h-6" />
                            <span>Lista de Tarefas</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton render={<a href="/home" />}>
                            <img src={CalendarIcon} alt="Calendário" className="w-6 h-6" />
                            <span>Calendário</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                     <SidebarMenuItem>
                        <SidebarMenuButton render={<a href="/home" />}>
                            <img src={InboxIcon} alt="Caixa de Entrada" className="w-6 h-6" />
                            <span>Caixa de Entrada</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}