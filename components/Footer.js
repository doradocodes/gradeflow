"use client";

import {GradeflowLogo} from "@/components/foundations/logo/gradeflow-logo";
import Link from "next/link";

const footerLinks = {
    Product: [
        {label: "Features", href: "/#features"},
        {label: "How it works", href: "/#how-it-works"},
        {label: "Pricing", href: "/pricing"},
    ],
    Account: [
        {label: "Sign up", href: "/signup"},
        {label: "Log in", href: "/login"},
        {label: "Forgot password", href: "/forgot-password"},
    ],
    Legal: [
        {label: "Privacy Policy", href: "/privacy"},
        {label: "Terms of Service", href: "/terms"},
    ],
};

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-1">
                        <GradeflowLogo className="h-8 mb-4" />
                        <p className="text-sm text-gray-500 max-w-xs">
                            An educator-first, AI-powered grading tool that saves you hours of time.
                        </p>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([heading, links]) => (
                        <div key={heading}>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">{heading}</h4>
                            <ul className="flex flex-col gap-2">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-500 hover:text-gray-900 transition"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Gradeflow. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

