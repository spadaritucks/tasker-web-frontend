import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface GoogleCalendarConnectCardProps {
    title: string;
    description: string;
    connectGoogleCalendar: () => void;
    isConnected: boolean
}

export default function GoogleCalendarConnectCard({ title, description, connectGoogleCalendar, isConnected }: GoogleCalendarConnectCardProps) {

    return (
        <Card className=" w-full h-22 flex items-center justify-center">
            <CardContent className="flex items-center justify-center w-full">
                <CardHeader className="w-full">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>

                <Button variant="default" disabled={isConnected} onClick={connectGoogleCalendar} className = "cursor-pointer">
                    {isConnected ? "Conectado" : "Conectar"}
                </Button>

            </CardContent>
        </Card>
    )
}




