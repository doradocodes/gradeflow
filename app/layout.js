import {DM_Sans} from "next/font/google";
import "./globals.css";
import {Analytics} from '@vercel/analytics/next';

const dmSans = DM_Sans({
    variable: "--font-dm-sans",
    subsets: ["latin"],
});

export const metadata = {
    title: "Gradeflow",
    description: "A AI-enhanced grading app for teachers",
};

export default function RootLayout({children}) {
    return (
        <html lang="en" className={`${dmSans.variable}`}>
            <body className="antialiased">
                {children}
                <Analytics/>
            </body>
        </html>
    );
}
