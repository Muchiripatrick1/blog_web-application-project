import { Col, Row } from "react-bootstrap";
import BlogPostEntry from "./BlogPostEntry";
import { blogPost } from "@/models/blog-post";
import styles from "@/styles/BlogPostGrid.module.css";

interface BlogPostGridProps {
    posts: blogPost[],
}

export default function BlogPostGrid ({posts}: BlogPostGridProps){
    return (
        <Row xs={1} sm={2} lg={3} className="g-4">
            {posts.map(post => (
                <Col key={post._id}>
                <BlogPostEntry post={post} className={styles.entry}/>
                </Col>
            ))}
            </Row>
    )
}