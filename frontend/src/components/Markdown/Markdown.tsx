import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm"
import remarkToc from "remark-toc"
import styles from "./Markdown.module.css";

interface markdownProps {
    children: string,
}

export default function Markdown ({children}: markdownProps){
    return (
        <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkToc, {maxDepth: 3, tight: true}]]}
        rehypePlugins={[rehypeSlug]}
        components={{
            img: ((props) => {
                <span className={styles.imageWrapper}>
                    <a href={props.src} target="_blank" rel="noreferrer"> 
                        <img {...props} alt={props.alt ?? ""} />
                    </a>
                </span>
            })
        }}
        >
            {children}
        </ReactMarkdown>
    );
}