'use client'

import ProtectedRoute from "@/components/ProtectedRoute";
import AssignmentsForm from "@/components/AssignmentsForm";
import AssignmentsList from "@/components/AssignmentsList";



export default function AssignmentsPage() {
    return <ProtectedRoute>
        <div className="p-4">
            <h1 className="text-xl font-bold">Assignments</h1>

            <AssignmentsList />
            <AssignmentsForm />
        </div>
    </ProtectedRoute>
}
