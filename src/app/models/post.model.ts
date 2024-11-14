import { User } from "./user"

export interface Post {
    id : number
    imageData? : String
    imageType? : String
    caption? : String
    createdAt : String
    user : User
    commentCount : number
    reactionCount : number
}

export interface PostResponse {
    imageData? : String
    imageType? : String
    caption? : String
    createdAt : String
    commentCount : number
    reactionCount : number
}
