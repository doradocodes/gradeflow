"use client";

import {auth} from "@/utils/firebase";
import {getAuth, signInWithEmailAndPassword, sendSignInLinkToEmail} from "firebase/auth";
import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/base/input/input";
import Link from "next/link";
import {Button} from "@/components/base/buttons/button";
import {redirect} from "next/navigation";
import {useAuth} from "@/components/AuthProvider";

export default function LoginForm() {
    const [user, setUser] = useState(null);
    const formRef = useRef(null);
    const [error, setError] = useState(null);
    const [isLoginWithPassword, setIsLoginWithPassword] = useState(false);

    // Listen for changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
        return () => unsubscribe();
    }, []);

    async function handleAuth(e) {
        e.preventDefault();

        const email = formRef.current.elements["Email"].value;
        const password = formRef.current.elements["Password"].value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // redirect to home page
            redirect('/assignments');
        } catch (err) {
            console.log("Auth error:", err.code);
            if (err.code === 'auth/user-not-found') {
                setError("No user found with this email.");
            } else if (err.code.indexOf('auth/invalid-credential') > -1) {
                setError("Invalid credentials. Please check your email and password.");
            } else {
                setError(err.message);
            }
        }
    }

    const handlePasswordLogin = () => {
        setIsLoginWithPassword(true);
    }

    const handleEmailLogin = async () => {
        const email = formRef.current.elements["Email"].value;
        if (!email) {
            setError("Please enter your email to receive the login link.");
            return;
        }

        const actionCodeSettings = {
            // URL you want to redirect back to. The domain (www.example.com) for this
            // URL must be in the authorized domains list in the Firebase Console.
            url: 'https://www.gradeflow.xyz/assignments',
            // This must be true.
            handleCodeInApp: true,
            // The domain must be configured in Firebase Hosting and owned by the project.
            // linkDomain: 'gradeflow.xyz',
        };
        try {
            const auth = await getAuth();
            await sendSignInLinkToEmail(auth, email, actionCodeSettings)
        } catch (e) {
            console.error("Error sending email link:", e);
        }
    }

    if (user) {
        redirect('/assignments');
    }

    return <>
        <div className="w-full max-w-md  bg-white rounded-2xl shadow-md p-6">
            <form className="flex flex-col gap-4" onSubmit={handleAuth} ref={formRef}>
                <Input type={"email"} name={"Email"} label="Email" placeholder={"Enter your email"} required/>
                {isLoginWithPassword && <>
                    <Input type={"password"} name={"Password"} label="Password" placeholder={"Enter your password"} required/>

                    <div className="flex items-center justify-between flex-wrap">
                        {/*<div>*/}
                        {/*    <Checkbox label="Remember me" size="sm" />*/}
                        {/*</div>*/}
                        <Link className="text-brand-primary text-sm" href="#">Forgot password?</Link>
                    </div>
                    <Button className="mt-4" color="primary" size="lg" type="submit">Login</Button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </>}
            </form>
            {!isLoginWithPassword && <>
                <Button className="mt-4 w-full" color="primary" size="lg" onClick={handlePasswordLogin}>Log in with password</Button>
                <Button className="mt-4 w-full" color="secondary" size="lg" onClick={handleEmailLogin}>Login with email code</Button>
            </>}
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        </div>
        <p className="mt-4"> Don't have an account? <Link className="text-brand-primary font-bold" href="/signup">Sign up →</Link></p>
    </>
}
