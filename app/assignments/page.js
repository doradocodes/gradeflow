'use client'

import ProtectedRoute from "@/components/ProtectedRoute";
import AssignmentsForm from "@/components/AssignmentsForm";
import AssignmentsList from "@/components/AssignmentsList";
import {useState} from "react";
import {NativeSelect} from "@/components/base/select/select-native";
import { Tabs } from "@/components/application/tabs/tabs";
import {Button} from "@/components/base/buttons/button";
import {PlusCircle} from "@untitledui/icons";
import SlideoutMenu from "@/components/SlideoutMenu";
import SubmissionsTable from "@/components/SubmissionsTable";




export default function AssignmentsPage() {
    const [openAssignmentsForm, setOpenAssignmentsForm] = useState(false);
    const [selectedTabIndex, setSelectedTabIndex] = useState("current_assignments");

    const tabs = [
        { id: "current_assignments", label: "Current Assignments"},
        { id: "past_assignments", label: "Past Assignments" },
    ];

    const onTabChange = (key) => {
        console.log(key);
        setSelectedTabIndex(key);
    }

    return <ProtectedRoute>
        <div className="w-full max-w-container py-8 md:px-8 mx-auto">
            <h1 className="text-2xl font-bold mb-2">Assignments</h1>
            <p className="mb-4 text-gray-500">View all your assignments.</p>
            <div className="mb-4 flex items-center justify-between">
                <NativeSelect
                    aria-label="Tabs"
                    value={selectedTabIndex}
                    onChange={(event) => setSelectedTabIndex(event.target.value)}
                    options={tabs.map((tab) => ({ label: tab.label, value: tab.id }))}
                    className="w-80 md:hidden"
                />
                <Tabs selectedKey={selectedTabIndex} onSelectionChange={onTabChange} className="w-max max-md:hidden">
                    <Tabs.List type="button-border" items={tabs}>
                        {(tab) => <Tabs.Item {...tab} />}
                    </Tabs.List>
                </Tabs>
                <Button
                    color="primary" size="sm" iconLeading={<PlusCircle data-icon />}
                    onClick={() => setOpenAssignmentsForm(true)}
                >Add assignment</Button>
            </div>
            {selectedTabIndex === "current_assignments" ?
                <AssignmentsList title="Current Assignments" date={new Date()} direction={"after"}/>
                :
                <AssignmentsList title="Past Assignments" date={new Date()} direction={"before"}/>
            }
        </div>
        <SlideoutMenu
            open={openAssignmentsForm}
            onClose={() => setOpenAssignmentsForm(false)}
            title={`Create new assignment`}
            description="Fill in the details to create a new assignment."
        >
            <AssignmentsForm />
        </SlideoutMenu>
    </ProtectedRoute>
}
