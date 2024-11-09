export interface User {
    id?: number;
    username?: string;
    password?: string;
    email: string;
    bio: string;
    profilePicture: string;
    postCount: number;
    followerCount: number;
    followingCount: number;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
  }
