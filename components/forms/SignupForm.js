"use client";

import {auth} from "@/utils/firebase";
import {createUserWithEmailAndPassword, updateProfile, signOut, validatePassword, getAuth} from "firebase/auth";
import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/base/input/input";
import {Button} from "@/components/base/buttons/button";
import Link from "next/link";
import {createUser} from "@/utils/firestore";
import {redirect} from "next/navigation";

export default function SignupForm() {
    const formRef = useRef(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);

    // Listen for changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
        return () => unsubscribe();
    }, []);

    async function handleAuth(e) {
        e.preventDefault();

        const name = formRef.current.elements["Name"].value;
        const email = formRef.current.elements["Email"].value;
        const password = formRef.current.elements["Password"].value;
        const confirmPassword = formRef.current.elements["Confirm Password"].value;
        console.log(name, email, password, confirmPassword);

        const status = await validatePassword(getAuth(), password);
        console.log(status);
        if (!status.isValid) {
            if (!status.meetsMinPasswordLength) {
                setPasswordError("Password must be at least 8 characters long.");
            }
            return;
        }

        // Check password confirmation
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, {
                displayName: name,
                // photoURL: "https://example.com/profile.jpg"
            });
            await createUser({
                uuid: result.user.uid,
                name,
                email,
            })

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
            <form className="flex flex-col gap-4" onSubmit={handleAuth} ref={formRef}>
                <Input type={"text"} name={"Name"} label="Name" placeholder={"Enter your full name"} required />
                <Input type={"email"} name={"Email"} label="Email" placeholder={"Enter your email"} required />
                <Input type={"password"} name={"Password"} label="Password" placeholder={"Enter your password"} required/>
                <Input type={"password"} name={"Confirm Password"} label="Confirm Password" placeholder={"Confirm your password"} required
                       hint={passwordError && <span className="text-red-500 text-sm">{passwordError}</span>}
                />

                <Button className="mt-4" color="primary" size="lg" type="submit">Create an account</Button>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>
        </div>
        <p className=" text-center"> Already have an account? <Link className="text-brand-primary font-bold" href="/login">Login →</Link></p>
    </>
}
