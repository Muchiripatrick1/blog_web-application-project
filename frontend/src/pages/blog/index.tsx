import { blogPostsPage } from "@/models/blog-post"
import { GetServerSideProps } from "next"
import * as BlogApi from "@/network/api/blog";
import BlogPostGrid from "@/components/BlogPostGrid";
import { stringify } from "querystring";
import PaginationBar from "@/components/PaginationBar";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps<BlogPageProps> = async ({ query }) => {

    const page = parseInt(query.page?.toString() || "1");

    if(page < 1){
        query.page = "1";
        return {
            redirect: {
                destination: "/blog?" +stringify( query ),
                permanent: false,
            }
        }
    }

    const data = await BlogApi.getBlogPosts(page)

    if(data.totalPages > 0 && page > data.totalPages){
        query.page = data.totalPages.toString();
        return {
            redirect: {
                destination: "/blog?" +stringify( query ),
                permanent: false,
            }
        }
    }


    return { props: { data }}
}

interface BlogPageProps {
    data: blogPostsPage,
}

export default function Blog ({ data : {blogPosts, page, totalPages}}: BlogPageProps){

    const router = useRouter();

    return (
        <div>
            <h1>Blog Posts</h1>
            {blogPosts.length > 0 && <BlogPostGrid posts={blogPosts}/>}
            <div className="d-flex flex-column align-items-centre">
                {blogPosts.length === 0 && <p>No blog posts found</p>}
                {blogPosts.length > 0 && 
                <PaginationBar 
                currentPage={page}
                pageCount={totalPages}
                onPageItemClicked={(page) => {
                    router.push({ query: { ...router.query, page}})

                }}
                className="mt-4"
                />
                }
            </div>
        </div>
    )
}