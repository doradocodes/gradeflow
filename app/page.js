"use client"; // because we’re using hooks + fetch

import { useState } from "react";
import {useAuth} from "@/components/AuthProvider";
import {redirect} from "next/navigation";
import {LoadingIndicator} from "@/components/application/loading-indicator/loading-indicator";
import {HeaderNavigationBase} from "@/components/application/app-navigation/header-navigation";
import Link from "next/link";
import {Button} from "@/components/base/buttons/button";
import {Badge} from "@/components/base/badges/badges";
import {Bell01, LayoutGrid01, Microphone01} from "@untitledui/icons";

export default function HomePage() {
    return (
        <div>
            <HeaderNavigationBase
                items={[]}
            />

            <main className="flex flex-col items-center text-center min-h-screen bg-white">
                {/* Hero */}
                <section className="w-full max-w-5xl py-24 px-6">
                    <h1 className="text-5xl font-bold tracking-tight mb-4">
                        Grade smarter. Teach better.
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                        Gradeflow helps educators receive creative assignments, record feedback, generate summaries, and
                        manage assignments — all in one place.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button
                            href="/signup"
                            color="primary"
                            size="lg"
                        >
                            Get Started
                        </Button>
                        <Button
                            href="/demo"
                            color="secondary"
                            size="lg"
                        >
                            Watch Demo
                        </Button>
                    </div>
                    <div className="mt-16 flex justify-center">
                        {/*<Image*/}
                        {/*    src="/images/dashboard-preview.png"*/}
                        {/*    alt="Gradeflow dashboard"*/}
                        {/*    width={900}*/}
                        {/*    height={500}*/}
                        {/*    className="rounded-2xl shadow-xl"*/}
                        {/*/>*/}
                    </div>
                </section>

                {/* Features */}
                <section className="bg-gray-50 w-full py-20">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
                        <Feature
                            icon={<Microphone01 data-icon className="inline-block align-sub mr-1"/>}
                            title="️Voice Feedback"
                            description="Record and transcribe student feedback instantly — no typing required."
                        />
                        <Feature
                            icon={<LayoutGrid01 data-icon className="inline-block align-sub mr-1"/>}
                            title="Smart Rubrics"
                            description="Customize rubrics and auto-categorize transcripts by criteria."
                        />
                        <Feature
                            icon={<Bell01 data-icon className="inline-block align-sub mr-1"/>}
                            title="Notifications"
                            description="Get notified when students submit assignments or request feedback."
                        />
                    </div>
                </section>

                {/* How it works */}
                <section className="w-full max-w-5xl py-20 px-6 text-left">
                    <h2 className="text-3xl font-semibold mb-8 text-center">
                        How it works
                    </h2>
                    <ol className="space-y-6 text-gray-700 text-center">
                        <li className="flex items-center justify-center gap-2 text-lg">
                            <Badge size="lg">1</Badge> Teachers create an assignment and share a link
                            with students.
                        </li>
                        <li className="flex items-center justify-center gap-2 text-lg">
                            <Badge size="lg">2</Badge> Students submit their assignments and teachers can provide feedback
                            via voice or text.
                        </li>
                        <li className="flex items-center justify-center gap-2 text-lg">
                            <Badge size="lg">3</Badge> Teachers can review submissions, generate summaries, submit feedback to students,
                            and manage assignments.
                        </li>
                    </ol>
                </section>

                {/* CTA */}
                <section className="bg-blue-600 text-white py-20 w-full text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Start grading with Gradeflow today.
                    </h2>
                    <Link
                        href="/signup"
                        className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
                    >
                        Create your free account
                    </Link>
                </section>
            </main>
        </div>
    );
}

function Feature({ icon, title, description }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">{icon} {title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}