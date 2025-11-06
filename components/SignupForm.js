"use client";

import {auth} from "@/utils/firebase";
import {createUserWithEmailAndPassword, updateProfile, signOut} from "firebase/auth";
import {useEffect, useState} from "react";
import {Input} from "@/components/base/input/input";
import {Button} from "@/components/base/buttons/button";
import Link from "next/link";
import {createUser} from "@/utils/firestore";
import {redirect} from "next/navigation";

export default function SignupForm() {

    const [user, setUser] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState(null);

    // Listen for changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
        return () => unsubscribe();
    }, []);

    async function handleAuth(e) {
        e.preventDefault();
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, {
                displayName: name,
                // photoURL: "https://example.com/profile.jpg"
            });
            await createUser({
                uuid: result.user.uid,
                name: name,
                email: email,

            })

            // redirect to home page
            window.location.href = "/assignments";
        } catch (err) {
            console.error("Auth error:", err);
            if (err.message.includes("auth/email-already-in-use")) {
                setError("Email already in use. Please try a different email.");
            } else {
                setError(err.message);
            }
        }
    }

    async function handleLogout() {
        await signOut(auth);
    }

    if (user) {
        redirect('/assignments');
    }

    return <>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 mb-4">
            <form className="flex flex-col gap-4" onSubmit={handleAuth}>
                <Input type={"text"} name={"Name"} label="Name" placeholder={"Enter your full name"} required onChange={value => setName(value)} />
                <Input type={"email"} name={"Email"} label="Email" placeholder={"Enter your email"} required onChange={value => setEmail(value)}/>

                <Input isInvalid={passwordError} type={"password"} name={"Password"} label="Password" placeholder={"Enter your password"} hint={passwordError || "Must be at least 8 characters."} required onChange={(value) => {
                    if (value.length >= 8) {
                        setPasswordError(null);
                        setPassword(value);
                    } else {
                        setPasswordError("Password must be at least 8 characters.");
                    }
                }}/>
                <Input isInvalid={confirmPasswordError} hint={confirmPasswordError} type={"password"} name={"Confirm Password"} label="Confirm Password" placeholder={"Confirm your password"} required onChange={(value) => {
                    if (password === value) {
                        setConfirmPasswordError(null);
                    } else {
                        setConfirmPasswordError("Passwords do not match.");
                    }
                }} />

                <Button className="mt-4" color="primary" size="lg" type="submit">Sign up</Button>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>
        </div>
        <p className=" text-center"> Already have an account? <Link className="text-brand-primary font-bold" href="/login">Login →</Link></p>
    </>
}
