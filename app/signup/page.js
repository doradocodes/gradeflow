import SignupForm from "@/components/forms/SignupForm";
import {GradeflowLogo} from "@/components/foundations/logo/gradeflow-logo";

export default function Signup() {
    return <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center h-screen min-w-screen">
            <GradeflowLogo className="mb-8" />
            <div className="flex flex-col gap-2 justify-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 text-center">Enter the grading flow.</h2>
                <p className="text-center text-gray-500 max-w-[500px] text-lg">Your first assignment is on us—so you can explore everything Gradeflow offers without commitment.</p>
            </div>
            <SignupForm />
        </div>
    </div>
}