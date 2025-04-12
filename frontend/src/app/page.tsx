import styles from "@/app/Home.module.css";
//import Image from "next/image";
import { Col, Row } from "@/components/bootstrap";
//import logo from "@/assets/images/flow-blog-logo.png";

export default function Home() {
  return (
    <>
      <div className={styles.main}>
        <Row className="align-items-centre mb-3 gap-2">
          <Col md="auto" className="px-1">
          <h1 className={styles.headlineText}>
            Flock Talk
          </h1>
          </Col>
        </Row>
        <h1 >Blog page by Muchiri Patrick</h1>
        <p>This is a <strong>full-stack</strong> blogging website built with <strong> NextJS, ExpressJS, </strong> and <strong>Typescript</strong> 💚</p>
        <p className="h5"><strong>Features</strong></p>
        <ul className="text-start w-80">
          <li><strong>Users accounts and profile</strong>. Sign up with email and password</li>
          <li>Users can create, update and edit blog posts via a <strong>markdown editor</strong></li>
          <li>A fully-fledged <strong>comment system</strong> with sub-comments and edit and delete functionalities</li>
          <li>Pagination with both <strong>page numbers</strong> and <strong>infinite loading </strong>.</li>
          <li>A fully <strong>mobile-responsive</strong> layout and custom themed based on Bootstrap</li>
          <li>A complete backend server built with <strong>ExpressJS</strong> and <strong>MongoDB</strong></li>
        </ul>
      </div>
    </>
  );
}
