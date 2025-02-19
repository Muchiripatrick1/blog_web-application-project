import { blogPost } from "@/models/blog-post"
import { GetStaticPaths, GetStaticProps } from "next"
import * as BlogApi from "@/network/api/blog";
import Head from "next/head";
import styles from "@/styles/BlogPostPage.module.css";
import Link from "next/link";
import { formatDate } from "@/utils/utils";
import Image from "next/image";
import { NotFoundError } from "@/network/http-errors";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import { FiEdit } from "react-icons/fi";
import BlogCommentSection from "@/components/comments/BlogCommentSection";
import Markdown from "@/components/Markdown";
import UserProfileLink from "@/components/UserProfileLink";


export const getStaticPaths: GetStaticPaths = async () =>{
    const slugs = await BlogApi.getAllBlogPostSlugs();

    const paths = slugs.map(slug =>({params: {slug}}))

    return {
        paths,
        fallback: "blocking",
    }
}


export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({params}) =>{
    try {
        const slug = params?.slug?.toString();
        if(!slug) throw Error ("slug missing");
    
        const post = await BlogApi.getBlogPostBySlug(slug);
        return { props: {post} }
    } catch (error) {
        if(error instanceof NotFoundError){
            return { notFound: true}
        } else {
            throw error;
        }
    }
 
}

interface BlogPostPageProps {
    post: blogPost,
}

export default function BlogPostPage({post: {_id, title, slug, summary, body, featuredImageUrl, author, createdAt, updatedAt}}: BlogPostPageProps){

    const { user } = useAuthenticatedUser();

    const updatedCreatedText = updatedAt > createdAt
    ? <>updated <time dateTime={updatedAt}>{formatDate(updatedAt)}</time></> 
    : <time dateTime={createdAt}>{formatDate(createdAt)}</time>;

    return (
        <>
        <Head>
        <title>{`${title}-Flock Talk`}</title>
        <meta name="Flock-talk blog." content={summary} />
        </Head>

        <div className={styles.container}>

            {user?._id === author._id &&
            <Link 
            href={"/blog/edit-post/" + slug}
            className="btn btn-outline-primary d-inline-flex align-items-centre gap-1 mb-2">
                <FiEdit />
                Edit post
            </Link>
            }
            
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
        </>
    )
}