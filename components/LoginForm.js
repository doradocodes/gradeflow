"use client";

import {auth} from "@/utils/firebase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,} from "firebase/auth";
import {useEffect, useState} from "react";

export default function LoginForm() {
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

    return <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Login</h2>
            <form className="flex flex-col" onSubmit={handleAuth}>
                <input type="email"
                       className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                       placeholder="Email address"
                       onChange={(e) => setEmail(e.target.value)}
                />
                <input type="password"
                       className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                       placeholder="Password"
                       onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex items-center justify-between flex-wrap">
                    <label htmlFor="remember-me" className="text-sm text-gray-900 cursor-pointer">
                        <input type="checkbox" id="remember-me" className="mr-2 align-middle"/>
                        Remember me
                    </label>
                    <a href="#" className="text-sm text-blue-500 hover:underline mb-0.5">Forgot password?</a>
                    <p className="text-gray-900 mt-4"> Don't have an account? <a href="/signup"
                                                                                 className="text-blue-500 -200 hover:underline mt-4">Signup</a>
                    </p>
                </div>
                <button type="submit"
                        className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150">Login
                </button>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
    </div>

}
