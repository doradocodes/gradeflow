'use client'

import ProtectedRoute from "@/components/ProtectedRoute";
import AssignmentsList from "@/components/AssignmentsList";
import {useState} from "react";
import {NativeSelect} from "@/components/base/select/select-native";
import {Tabs} from "@/components/application/tabs/tabs";


export default function AssignmentsPage() {
    const [selectedTabIndex, setSelectedTabIndex] = useState("all");

    const tabs = [
        {id: 'all', label: "All assignments", filters: {}},
        {
            id: "current", label: "Current assignments", filters: {
                date: new Date(),
                direction: "after",
            }
        },
        {
            id: "past", label: "Past assignments", filters: {
                date: new Date(),
                direction: "before",
            }
        },
    ];

    const onTabChange = (key) => {
        setSelectedTabIndex(key);
    }

    return <ProtectedRoute>
        <div className="w-full max-w-container py-8 md:px-8 mx-auto z-10">
            <h1 className="text-2xl font-bold mb-2">Assignments</h1>
            <p className="mb-4 text-gray-500">View all your assignments.</p>
            <div className="mb-4 flex items-center justify-between">
                <NativeSelect
                    aria-label="Tabs"
                    value={selectedTabIndex}
                    onChange={(event) => setSelectedTabIndex(event.target.value)}
                    options={tabs.map((tab) => ({label: tab.label, value: tab.id}))}
                    className="w-80 md:hidden"
                />
                <Tabs selectedKey={selectedTabIndex} onSelectionChange={onTabChange} className="w-max max-md:hidden">
                    <Tabs.List type="button-border" items={tabs}>
                        {(tab) => <Tabs.Item {...tab} />}
                    </Tabs.List>
                </Tabs>
            </div>
            {tabs.map((tab) => (
                tab.id === selectedTabIndex && <AssignmentsList title={tab.label} filters={tab.filters} key={tab.id} />
            ))}
        </div>
    </ProtectedRoute>
}
