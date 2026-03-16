"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { auth } from "@/utils/firebase";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { Input } from "@/components/base/input/input";
import { Button } from "@/components/base/buttons/button";
import { GradeflowLogo } from "@/components/foundations/logo/gradeflow-logo";
import Link from "next/link";

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const oobCode = searchParams.get("oobCode");

    const formRef = useRef(null);
    const [email, setEmail] = useState(null);
    const [error, setError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [invalidCode, setInvalidCode] = useState(false);

    // Verify the reset code on mount
    useEffect(() => {
        if (!oobCode) {
            setInvalidCode(true);
            setLoading(false);
            return;
        }

        verifyPasswordResetCode(auth, oobCode)
            .then((userEmail) => {
                setEmail(userEmail);
                setLoading(false);
            })
            .catch(() => {
                setInvalidCode(true);
                setLoading(false);
            });
    }, [oobCode]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setPasswordError(null);

        const password = formRef.current.elements["Password"].value;
        const confirmPassword = formRef.current.elements["Confirm Password"].value;

        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, password);
            setSuccess(true);
        } catch (err) {
            console.error("Password reset error:", err);
            if (err.code === "auth/expired-action-code") {
                setError("This reset link has expired. Please request a new one.");
            } else if (err.code === "auth/invalid-action-code") {
                setError("This reset link is invalid or has already been used.");
            } else if (err.code === "auth/weak-password") {
                setPasswordError("Password is too weak. Please choose a stronger password.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-gray-500">Verifying reset link...</p>
            </div>
        );
    }

    if (invalidCode) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center justify-center min-w-screen">
                    <GradeflowLogo className="mb-8" />
                    <div className="flex flex-col gap-2 justify-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 text-center">Invalid reset link</h2>
                        <p className="text-center text-gray-500 max-w-[500px] text-lg">
                            This password reset link is invalid or has expired.
                        </p>
                    </div>
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 mb-4 flex flex-col gap-4">
                        <Link href="/forgot-password">
                            <Button color="primary" size="lg" className="w-full">
                                Request a new reset link
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col items-center justify-center min-w-screen">
                    <GradeflowLogo className="mb-8" />
                    <div className="flex flex-col gap-2 justify-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 text-center">Password reset successful</h2>
                        <p className="text-center text-gray-500 max-w-[500px] text-lg">
                            Your password has been updated. You can now log in with your new password.
                        </p>
                    </div>
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 mb-4 flex flex-col gap-4">
                        <Link href="/login">
                            <Button color="primary" size="lg" className="w-full">
                                Go to Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center justify-center min-w-screen">
                <GradeflowLogo className="mb-8" />
                <div className="flex flex-col gap-2 justify-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center">Set a new password</h2>
                    <p className="text-center text-gray-500 max-w-[500px] text-lg">
                        Enter a new password for <strong>{email}</strong>.
                    </p>
                </div>
                <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 mb-4">
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit} ref={formRef}>
                        <Input type="password" name="Password" label="New Password" placeholder="Enter your new password" required />
                        <Input
                            type="password"
                            name="Confirm Password"
                            label="Confirm Password"
                            placeholder="Confirm your new password"
                            required
                            hint={passwordError && <span className="text-red-500 text-sm">{passwordError}</span>}
                        />
                        <Button className="mt-4" color="primary" size="lg" type="submit">
                            Reset password
                        </Button>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    </form>
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

