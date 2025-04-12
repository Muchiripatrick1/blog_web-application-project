import {  Metadata } from "next"
import * as BlogApi from "@/network/api/blog";
import BlogPostGrid from "@/components/blog/BlogPostGrid";
import { stringify } from "querystring";
import BlogPaginationBar from "./BlogPaginationBar";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Articles - Flock Talk",
    description: "Read lates articles about Flock Talk"
}



interface BlogPageProps {
    searchParams: { page?: string},
}

export default async function Blog ({ searchParams}: BlogPageProps){


    const page = await parseInt(searchParams.page?.toString() || "1");

    if(page < 1){
        searchParams.page = "1";
        redirect("/blog?" + stringify(searchParams));
    }

    const { blogPosts, page: currentPage, totalPages} = await BlogApi.getBlogPosts(page)

    if(totalPages > 0 && page > totalPages){
        searchParams.page = totalPages.toString();
        redirect("/blog?" + stringify(searchParams));
    }

    return (
        <div>
            <h1>Blog Posts</h1>
            {blogPosts.length > 0 && <BlogPostGrid posts={blogPosts}/>}
            <div className="d-flex flex-column align-items-centre">
                {blogPosts.length === 0 && <p>No blog posts found</p>}
                {blogPosts.length > 0 && 
               <BlogPaginationBar
               currentPage={currentPage}
               totalPages={totalPages}
               />
                }
            </div>
        </div>
    )
}