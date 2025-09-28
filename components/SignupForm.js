"use client";

import {auth} from "@/utils/firebase";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,} from "firebase/auth";
import {useEffect, useState} from "react";

export default function SignupForm() {
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
            await createUserWithEmailAndPassword(auth, email, password);
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

    return <div className="flex flex-col items-center justify-center h-screen min-w-screen">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create an account</h2>
            <form className="flex flex-col" onSubmit={handleAuth}>
                <input type="text"
                       className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                       placeholder="Full name"
                       onChange={() => {}}
                />
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
                <input type="text"
                       className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 mb-4 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
                       placeholder="School name"
                       onChange={() => {}}
                />
                <div className="flex items-center justify-between flex-wrap">
                    <p className="text-gray-900 mt-4"> Already have an account? <a href="#"
                                                                                 className="text-blue-500 -200 hover:underline mt-4">Login</a>
                    </p>
                </div>
                <button type="submit"
                        className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150">Sign up
                </button>
            </form>
        </div>
    </div>

}
