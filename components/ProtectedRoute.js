"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import {HeaderNavigationBase} from "@/components/application/app-navigation/header-navigation";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) return <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator type="line-simple" size="sm" />
    </div>;

    if (!user) {
        // redirect if not logged in
        router.push("/login");
        return null;
    }

    return <div className="">
        <HeaderNavigationBase
            user={user}
            items={[
                { label: "Assignments", href: "/assignments" },
            ]}
        />
        {children}
    </div>;
}