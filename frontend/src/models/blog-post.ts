import { User } from "./users";

export interface blogPost {
    _id: string,
    slug: string,
    title: string,
    summary: string,
    body: string,
    featuredImageUrl: string,
    author: User,
    createdAt: string,
    updatedAt: string,

}


export interface blogPostsPage {
    blogPosts: blogPost[],
    page: number,
    totalPages: number,
}