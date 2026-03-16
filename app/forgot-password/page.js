"use client";

import { useState, useRef } from "react";
import { auth } from "@/utils/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";
import { GradeflowLogo } from "@/components/foundations/logo/gradeflow-logo";
import Link from "next/link";

export default function ForgotPassword() {
    const formRef = useRef(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setMessage(null);

        const email = formRef.current.elements["Email"].value;

        try {
            await sendPasswordResetEmail(auth, email, {
                url: `${window.location.origin}/login`,
                handleCodeInApp: false,
            });
            setSubmitted(true);
            setMessage(`We've sent a password reset link to ${email}. Check your inbox.`);
        } catch (err) {
            console.error("Password reset error:", err);
            if (err.code === "auth/user-not-found") {
                setError("No account found with that email address.");
            } else if (err.code === "auth/invalid-email") {
                setError("Please enter a valid email address.");
            } else if (err.code === "auth/too-many-requests") {
                setError("Too many requests. Please wait a few minutes before trying again.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center min-w-screen">
                <GradeflowLogo className="mb-8" />
                <div className="flex flex-col gap-2 justify-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">Reset your password</h2>
                    <p className="text-center text-gray-500 max-w-[500px] text-lg">
                        Enter the email associated with your account and we'll send you a link to reset your password.
                    </p>
                </div>
                <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 mb-4">
                    {!submitted ? (
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit} ref={formRef}>
                            <Input type="email" name="Email" label="Email" placeholder="Enter your email" required />
                            <Button className="mt-4" color="primary" size="lg" type="submit">
                                Send reset link
                            </Button>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        </form>
                    ) : (
                        <div className="flex flex-col gap-4 text-center">
                            <p className="text-green-600 text-sm">{message}</p>
                            <Button color="secondary" size="lg" onClick={() => setSubmitted(false)}>
                                Send again
                            </Button>
                        </div>
                    )}
                </div>
                <p className="text-center">
                    Back to{" "}
                    <Link className="text-brand-primary font-bold" href="/login">
                        Login →
                    </Link>
                </p>
            </div>
        </div>
    );
}

