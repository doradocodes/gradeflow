'use client';

import {Input} from "@/components/base/input/input";
import {useAuth} from "@/components/AuthProvider";

export default function UserSettingsForm({}) {
    const {user, loading} = useAuth();

    return <>
        <div className={"mt-8 flex flex-col gap-4 border border-gray-200 p-6 rounded-lg"}>
            <div>
                <h2 className="font-bold text-xl">Personal info</h2>
                <p className={"text-gray-500 mb-4"}>Update your personal information such as name, email, and profile picture.</p>
            </div>
            <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">Name</span>
                <div className="w-1/2">
                    <Input className="w-full" name="name" defaultValue={user.displayName} />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">Email</span>
                <div className="w-1/2">
                    <Input className="w-full" name="email" defaultValue={user.email} />
                </div>
            </div>
            <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">Password</span>
                <div className="w-1/2">
                    <Input className="w-full" name="password" defaultValue={user.password} />
                </div>
            </div>
        </div>
    </>

}