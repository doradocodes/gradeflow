"use client";

import { useEffect, useState } from "react";
import { auth } from "@/utils/firebase";
import { sendEmailVerification } from "firebase/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { GradeflowLogo } from "@/components/foundations/logo/gradeflow-logo";

export default function VerifyEmail() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // If not logged in, redirect to login
    if (!loading && !user) {
        redirect("/login");
    }

    // If already verified, redirect to assignments
    if (!loading && user?.emailVerified) {
        redirect("/assignments");
    }

    async function handleResend() {
        if (!user) return;
        try {
            await sendEmailVerification(user);
            setMessage("Verification email sent! Check your inbox.");
            setResendDisabled(true);
            setTimeout(() => setResendDisabled(false), 60000); // 60s cooldown
        } catch (err) {
            console.error("Error resending verification email:", err);
            if (err.code === "auth/too-many-requests") {
                setMessage("Too many requests. Please wait a few minutes before trying again.");
            } else {
                setMessage("Failed to send verification email. Please try again.");
            }
        }
    }

    async function handleCheckVerification() {
        if (!user) return;
        await user.reload();
        if (user.emailVerified) {
            redirect("/assignments");
        } else {
            setMessage("Email not yet verified. Please check your inbox and click the verification link.");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center min-w-screen">
                <GradeflowLogo className="mb-8" />
                <div className="flex flex-col gap-2 justify-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">Verify your email</h2>
                    <p className="text-center text-gray-500 max-w-[500px] text-lg">
                        We sent a verification link to <strong>{user?.email}</strong>. Please check your inbox and click the link to verify your account.
                    </p>
                </div>
                <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 mb-4 flex flex-col gap-4">
                    <Button color="primary" size="lg" onClick={handleCheckVerification}>
                        I've verified my email
                    </Button>
                    <Button color="secondary" size="lg" onClick={handleResend} disabled={resendDisabled}>
                        {resendDisabled ? "Email sent — check your inbox" : "Resend verification email"}
                    </Button>
                    {message && <p className="text-sm text-center text-gray-600">{message}</p>}
                </div>
            </div>
        </div>
    );
}

