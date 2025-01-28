import "@/styles/globals.scss";
import "@/styles/utils.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import Head from "next/head";
import { Container } from "react-bootstrap";
import styles from "@/styles/App.module.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import NextNProgress from "nextjs-progressbar";
import AuthModalsProvider from "@/components/auth/AuthModalsProvider";



const inter = Inter({subsets: ['latin']})

export default function App({ Component, pageProps }: AppProps) {


  return( 
     <>
      <Head>
        <title>Flock Talk app</title>
        <meta name="Flock-tak app" content="Flock-talk app. Tell something about your farm." />
      </Head>

<AuthModalsProvider>
  <div className={inter.className}>
    <NextNProgress color="#21FA90"/>
    <NavBar/>
    <main>

      <Container className={styles.pageContainer}>
    <Component {...pageProps} />
    </Container>

    </main>

    <Footer/>
    </div>
    </AuthModalsProvider>
  </>
  )};
