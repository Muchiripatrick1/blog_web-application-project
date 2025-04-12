import { Container } from "@/components/bootstrap";
import styles from "./Footer.module.css";
import Link from "next/link";

export default function Footer (){
    return (
        <footer className={styles.footer}>
            <Container>
                <p>© {new Date().getFullYear()} Blog by Patrick Muchiri</p>
                <ul>
                    <li><Link href="/imprint">Imprint</Link></li>
                    <li><Link href="/privacy">Privacy</Link></li>
                </ul>
            </Container>
        </footer>
    )
}