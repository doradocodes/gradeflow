import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
    return <ProtectedRoute>
        <h1>Dashboard</h1>
        <p>Welcome to the dashboard!</p>
        <h2>Assignments</h2>
    </ProtectedRoute>
}