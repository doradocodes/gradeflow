"use client";

import {auth} from "@/utils/firebase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,} from "firebase/auth";
import {useEffect, useState} from "react";
import {Input} from "@/components/base/input/input";
import {GradeflowLogo} from "@/components/foundations/logo/gradeflow-logo";
import {Checkbox} from "@/components/base/checkbox/checkbox";
import Link from "next/link";
import {Button} from "@/components/base/buttons/button";
import {redirect} from "next/navigation";

export default function LoginForm() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    // Listen for changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
        return () => unsubscribe();
    }, []);

    async function handleAuth(e) {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // redirect to home page
            redirect('/assignments');
        } catch (err) {
            console.error("Auth error:", err.message);
            setError(err.message);
        }
    }

    async function handleLogout() {
        await signOut(auth);
    }

    if (user) {
        redirect('/assignments');
    }

    return <div className="flex flex-col items-center justify-center h-screen min-w-screen">
        <GradeflowLogo className="mb-8" />
        <div className="flex flex-col gap-2 justify-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Welcome back</h2>
            <p className="text-center text-gray-500">Please enter your details.</p>
        </div>
        <div className="w-full max-w-md  bg-white rounded-lg shadow-md p-6">
            <form className="flex flex-col gap-4" onSubmit={handleAuth}>
                <Input type={"email"} name={"Email"} label="Email" placeholder={"Enter your email"} required onChange={value => setEmail(value)}/>
                <Input type={"password"} name={"Password"} label="Password" placeholder={"Enter your password"} required onChange={value => setPassword(value)}/>

                <div className="flex items-center justify-between flex-wrap">
                    <div>
                        <Checkbox label="Remember me" size="sm" />
                    </div>
                    <Link className="text-brand-primary text-sm" href="#">Forgot password?</Link>
                </div>
                <Button className="mt-4" color="primary" size="lg" type="submit">Login</Button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
        <p className="text-gray-900 mt-4"> Don't have an account? <Link className="text-brand-primary" href="/signup">Sign up</Link></p>

    </div>

}
