//import React, { Suspense } from "react";
import "./globals.scss";
import "./utils.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthModalsProvider from "./AuthModalsProvider";
import { Container } from "@/components/bootstrap";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
//import OnboardingRedirect from "./OnboardingRedirect";


const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
    title: "Flock Talk app",
    description: "Flock-talk app. Tell something about your farm.",
}

export default function RootLayout (
    {children}: {children: React.ReactNode}
){
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthModalsProvider>
                    <NavBar/>
                    <main>
                        <Container className="py-4">
                {children}
                </Container>
                </main>
                <Footer/>
              
                </AuthModalsProvider>
                </body>
        </html>
    )
}

//  //*<Suspense>
//<OnboardingRedirect/>
//</Suspense>*//
//chini ya futa