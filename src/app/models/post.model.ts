import { User } from "./user"

export interface Post {
    id : number
    imageData : string
    imageType : string
    caption? : string
    createdAt : string
    user : User
    commentCount : number
    reactionCount : number
}

export interface PostResponse {
    imageData? : string
    imageType? : string
    caption? : string
    createdAt : string
    commentCount : number
    reactionCount : number
}
