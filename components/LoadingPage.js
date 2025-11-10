import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";

export default function () {
    return <div className="w-full max-w-container py-8 md:px-8 mx-auto min-h-screen flex items-center justify-center">
        <LoadingIndicator type="line-simple" size="sm" />
    </div>
}