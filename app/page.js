"use client"; // because we’re using hooks + fetch

import { useState } from "react";
import {useAuth} from "@/components/AuthProvider";
import Button from "@/components/Button";
import {redirect} from "next/navigation";

export default function HomePage() {
    const { user, loading } = useAuth();


    if (loading) return <p>Loading...</p>;


    return (
        <div>
            <h1>Welcome, {user.email}</h1>
            <Button onClick={() => redirect('/dashboard')}>Go to Dashboard</Button>
        </div>
    );
}
