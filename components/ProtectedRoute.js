"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) return <p>Loading...</p>;

    if (!user) {
        // redirect if not logged in
        router.push("/login");
        return null;
    }

    return <>
        <Nav/>
        {children}
    </>;
}