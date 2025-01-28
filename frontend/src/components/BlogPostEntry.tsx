import { blogPost } from "@/models/blog-post";
import { formatDate } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { Card } from "react-bootstrap";
import UserProfileLink from "./UserProfileLink";

interface BlogPostEntryProps {
    post: blogPost,
    className: string,
}

export default function BlogPostEntry({post: { slug, title, featuredImageUrl, author, summary, createdAt    }, className}: BlogPostEntryProps){

    const postLink = "/blog/" + slug
return (
    <Card className={className}>
       <article>
        <Link href={postLink}>
        <Image
        src={featuredImageUrl}
        alt="Blog post featured image"
        width={550}
        height={200}
        className="card-img-top object-fit-cover"
        />
        </Link>
        <Card.Body>
            <Card.Title>
                <Link href={postLink}>
                {title}
                </Link>
            </Card.Title>
        </Card.Body>
            <Card.Text>{summary}</Card.Text>
            <Card.Text><UserProfileLink  user={author}/></Card.Text>
            <Card.Text className="text-muted small">
                <time dateTime={createdAt}>
                {formatDate(createdAt)}
                </time>
                </Card.Text>
       </article>
    </Card>
)
}