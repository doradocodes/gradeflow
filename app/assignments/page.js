'use client'

import ProtectedRoute from "@/components/ProtectedRoute";
import AssignmentsForm from "@/components/AssignmentsForm";
import {useEffect, useState} from "react";
import {getAssignments} from "@/utils/firestore";
import Button from "@/components/Button";
import Link from "next/link";
import {ArrowRightIcon} from "@heroicons/react/16/solid";
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import RubricForm from "@/components/RubricForm";
import DeliverablesForm from "@/components/DeliverablesForm";
import {useAuth} from "@/components/AuthProvider";
import AssignmentsList from "@/components/AssignmentsList";



export default function AssignmentsPage() {
    return <ProtectedRoute>
        <div className="p-4">
            <AssignmentsList />
            <AssignmentsForm />
        </div>
    </ProtectedRoute>
}
