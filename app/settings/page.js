import ProtectedRoute from "@/components/ProtectedRoute";
import UserSettingsForm from "@/components/forms/UserSettingsForm";

export default function () {
    return <ProtectedRoute>
        <div className="w-full max-w-container py-8 md:px-8 mx-auto z-10">
            <h1 className="text-2xl font-bold mb-2">User Settings</h1>
            <p className="mb-4 text-gray-500">Manage your account settings and preferences.</p>
            <UserSettingsForm />
        </div>
    </ProtectedRoute>
}