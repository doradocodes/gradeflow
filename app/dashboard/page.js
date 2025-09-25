import ProtectedRoute from "@/components/ProtectedRoute";
import {useAuth} from "@/components/AuthProvider";

export default function DashboardPage() {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;


    return <ProtectedRoute>
        <h1>Dashboard</h1>
        <p>Welcome to the dashboard!</p>
        <h2>Assignments</h2>

    </ProtectedRoute>
}