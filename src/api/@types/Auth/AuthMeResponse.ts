export type AuthmeResponse = {

    authenticated: boolean;
    expiresIn: number;
    expiresAt : string;
    user : UserProfile


}

export type UserProfile = {
    id : string;
    name : string;
    email : string;
    createdAt : string;
}