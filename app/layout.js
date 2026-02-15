import {DM_Sans} from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/components/AuthProvider";
import {Analytics} from "@vercel/analytics/vue";

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin",]
});

export const metadata = {
    title: "Gradeflow",
    description: "A AI-enhanced grading app for teachers",
};

export default function RootLayout({children}) {
    return (
        <html lang="en" className={`${dmSans.variable}`}>
        <body
            className={`antialiased`}
        >
        <AuthProvider>
            {children}
        </AuthProvider>
        <Analytics />
        </body>
        </html>
    );
}
