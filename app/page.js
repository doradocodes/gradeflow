"use client"; // because we’re using hooks + fetch

import { useState } from "react";
import {useAuth} from "@/components/AuthProvider";
import {redirect} from "next/navigation";

export default function HomePage() {
    const { user, loading } = useAuth();


    if (loading) return <LoadingIndicator type="line-simple" size="sm" />;

    if (!user) {
        // redirect if not logged in
        redirect('/login');
        return null;
    }

    return (
        <div>
            <h1>Welcome, {user.email}</h1>
        </div>
    );
}
