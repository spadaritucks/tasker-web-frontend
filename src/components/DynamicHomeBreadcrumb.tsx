import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";


interface DynamicHomeBreadcrumbProps {
    pathName: string;
}

export default function DynamicHoneBreadcrumb({ pathName }: DynamicHomeBreadcrumbProps) {


    const sideBarPageMapper = () => {
        switch (pathName) {
            case "home":
                return "Visão Geral"
            case "tasks":
                return "Lista de Tarefas"
            case "calendar":
                return "Calendario"
            case "inbox":
                return "Caixa de Entrada"
        }
    }





    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{sideBarPageMapper()}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    )
}