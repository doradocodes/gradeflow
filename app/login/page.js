import LoginForm from "@/components/forms/LoginForm";
import {GradeflowLogo} from "@/components/foundations/logo/gradeflow-logo";

export default function LoginPage() {
    return <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center h-screen min-w-screen">
            <GradeflowLogo className="mb-8" />
            <div className="flex flex-col gap-2 justify-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center">Welcome back</h2>
                <p className="text-center text-gray-500">Please enter your details.</p>
            </div>
            <LoginForm />
        </div>
    </div>
}