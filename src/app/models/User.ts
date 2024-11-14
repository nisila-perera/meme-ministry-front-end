export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    bio: string;
    profilePictureType?: string;
    coverPictureType?: string;
    profilePictureData?: string;
    coverPictureData?: string;
    postCount: number;
    followerCount: number;
    followingCount: number;
}


export interface AuthResponse {
    user: User;
    token: string;
}
