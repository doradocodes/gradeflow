"use client";

import { auth } from "@/utils/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { useEffect, useState } from "react";

export default function Login() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isNewUser, setIsNewUser] = useState(false);
    const [error, setError] = useState(null);

    // Listen for changes
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
        return () => unsubscribe();
    }, []);

    async function handleAuth(e) {
        e.preventDefault();
        try {
            if (isNewUser) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            // redirect to home page
            window.location.href = "/";
        } catch (err) {
            console.error("Auth error:", err.message);
            setError(err.message);
        }
    }

    async function handleLogout() {
        await signOut(auth);
    }

    if (user) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm">Welcome, {user.email}</span>
                <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm border rounded"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleAuth} className="flex flex-col gap-2 w-64">
            <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="px-3 py-1 text-sm border rounded">
                {isNewUser ? "Sign Up" : "Login"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
            <button
                type="button"
                onClick={() => setIsNewUser(!isNewUser)}
                className="text-xs text-blue-500 underline"
            >
                {isNewUser ? "Already have an account? Login" : "New here? Create account"}
            </button>
        </form>
    );
}
