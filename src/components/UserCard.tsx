import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";

interface UserCardProps {
    profilePicture: string;
    name: string
}


export default function UserCard(userCardProps: UserCardProps) {

    return (
        <Card className="w-[95%] h-12 rounded-sm flex items-start justify-center cursor-pointer hover:bg-gray-100 transition-colors duration-75">
            <CardContent className="flex items-center justify-center gap-2">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center">
                    <h3 className="font-bold">{userCardProps.name}</h3>
                    <p className="text-[12px] text-gray-400">Meu Espaço</p>
                </div>
            </CardContent>
        </Card>
    )
}