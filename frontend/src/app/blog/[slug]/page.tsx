import * as BlogApi from "@/network/api/blog";
import styles from "./BlogPostPage.module.css";
import Link from "next/link";
import { formatDate } from "@/utils/utils";
import Image from "next/image";
import { NotFoundError } from "@/network/http-errors";
import BlogCommentSection from "@/components/comments/BlogCommentSection";
import Markdown from "@/components/Markdown/Markdown";
import UserProfileLink from "@/components/UserProfileLink";
import { notFound } from "next/navigation";
import EditPostButton from "./EditPostButton";
import { Metadata } from "next";
//import { cache } from "react";
import { unstable_cache } from "next/cache";



interface pageProps {
    params: {slug: string},
}

const getPost = (slug: string) => unstable_cache(async function (slug: string){
    try {
        return await BlogApi.getBlogPostBySlug(slug);
    } catch (error) {
        if(error instanceof NotFoundError){
             notFound();
        } else {
            throw error;
        }
    }
},
[slug],
{tags: [slug]}
)(slug);


export async function generateMetadata({params: {slug}}: pageProps): Promise<Metadata>{

    const blogPost = await getPost(slug);
    
    return{
        title: `${blogPost.title}-Flock Talk`,
        description: blogPost.summary,
        openGraph: {
            images: [{url: blogPost.featuredImageUrl}]
        }
    }
}


export async function generateStaticParams() {
    const slugs = await BlogApi.getAllBlogPostSlugs();
    return slugs.map((slug) => ({slug}));

}

export default async function BlogPostPage({params: {slug}}: pageProps){


    

    const {
        _id, 
        title, 
        summary, 
        body, 
        featuredImageUrl, 
        author, 
        createdAt, 
        updatedAt
    }= await getPost(slug);

    const updatedCreatedText = updatedAt > createdAt
    ? <>updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time></> 
    : <time dateTime={createdAt}>{formatDate(createdAt)}</time>;

    return (
       

        <div className={styles.container}>

         {author?._id && (
        <EditPostButton authorId={author._id} slug={slug} />
        )}

            
            <div className="text-centre mb-4">
                <Link href="/blog">← Blog Home</Link>
            </div>

            <article>
                <div className="d-flex flex-column align-items-centre">
                    <h1 className="text-centre mb-3">{title}</h1>
                    <p className="text-centre mb-3 h5">{summary}</p>
                    <p className="d-flex gap-2 align-items-centre">
                        Posted by
                        <UserProfileLink user={author}/>
                    </p>
                    <span className="text-muted">{updatedCreatedText}</span>
                    <div className={styles.featuredImageWrapper}>
                    <Image
                    src={featuredImageUrl}
                    alt="Blog post featured image"
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    priority
                    className="rounded"
                    />
                    </div>
                </div>
                    <Markdown>{body}</Markdown> 
            </article>
            <hr/>
            <BlogCommentSection blogPostId={_id} />
        </div>
    )
}

