"use client";

import { User } from "@/models/users";
import { useState } from "react";
import useSWR from "swr";
import * as BlogApi from "@/network/api/blog";
import BlogPostGrid from "@/components/blog/BlogPostGrid";
import PaginationBar from "@/components/PaginationBar";
import { Spinner } from "react-bootstrap";

interface UserBlogPostsSectionProps {
    user: User,
}


export default function UserBlogPostsSection ({user}: UserBlogPostsSectionProps) {

    const [page, setPage] = useState(1);

    const { data, isLoading: blogPostsLoding, error: blogPostsLoadinError} = 
    useSWR([user._id, page, "user_posts"], ([userId, page]) => BlogApi.getBlogPostsByUser(userId, page));

    const blogPosts = data?.blogPosts || [];
    const totalPages = data?.totalPages || 0;

    return (
        <div>
            <hr/>
            <h2>Blog posts</h2>
            {blogPosts.length > 0 && <BlogPostGrid posts={blogPosts}/>}
            <div className="d-flex flex-column align-items-centre">
                {blogPosts.length > 0 &&
                <PaginationBar
                currentPage={page}
                pageCount={totalPages}
                onPageItemClicked={(page) => setPage(page)}
                className="mt-4"
                />
                }
                { blogPostsLoding && <Spinner animation="border"/>}
                {blogPostsLoadinError && <p>Blog posts could not be loaded</p>}
                { !blogPostsLoding && !blogPostsLoadinError && blogPosts.length === 0 &&
                 <p>User have not posted anything</p>
                 }
                
            </div>
        </div>

    )
 
}



