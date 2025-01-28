import { User } from "./users";

export interface Comment {
    _id: string,
    blogPostId: string,
    parentCommentId?: string,
    author: User,
    text: string,
    createAt: string,
    updatedAt: string,
    repliesCount?: number,
}


export interface CommentsPage {
    comments: Comment[],
    endOfPaginationReached: boolean,
}