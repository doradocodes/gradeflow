"use client"; // because we’re using hooks + fetch

import {HeaderNavigationBase} from "@/components/application/app-navigation/header-navigation";
import {Button} from "@/components/base/buttons/button";
import {Bell01, LayoutGrid01, Microphone01} from "@untitledui/icons";
import Image from "next/image";

export default function HomePage() {
    return (
        <div>
            <HeaderNavigationBase
                items={[]}
            />

            <main className="flex flex-col items-center text-center min-h-screen bg-white">
                {/* Hero */}
                <section className="bg-gray-50 w-full py-24 px-6">
                    <h1 className="text-5xl font-bold tracking-tight mb-8">
                        An <span className="select-none font-deco text-[var(--color-secondary-500)] transition-transform duration-300 ease-in-out hover:[transform:rotate(5deg)] inline-block ">educator</span>-first,<br/> <span className="select-none font-deco text-[var(--color-secondary-500)] transition-transform duration-300 ease-in-out hover:[transform:rotate(5deg)] inline-block">AI</span> powered grading tool.
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
                            Get started
                        </Button>
                        <Button
                            href="/demo"
                            color="secondary"
                            size="lg"
                        >
                            Watch demo
                        </Button>
                    </div>
                    <div className="mt-16 flex justify-center">
                        <Image
                            src="/demo.png"
                            alt="Gradeflow dashboard"
                            width={900}
                            height={500}
                            className="rounded-2xl shadow-xl rounded-lg"
                        />
                    </div>
                </section>

                {/* Features */}
                <section className="w-full py-20 min-h-96">
                    <h2 className="text-5xl font-semibold mb-8 text-center">
                        Features
                    </h2>
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
                    <h2 className="text-5xl font-semibold mb-8 text-center">
                        How it works
                    </h2>
                    <ol className="space-y-8 font-medium max-w-3xl mx-auto">
                        <Step index={1} description="Teachers create an assignment and share a link with students." />
                        <Step index={2} description="Students submit their assignments and teachers can provide feedback via voice or text." />
                        <Step index={3} description="Teachers can review submissions, generate summaries, submit feedback to students, and manage assignments." />
                    </ol>
                </section>

                {/* CTA */}
                <section className="bg-gray-50 py-20 w-full text-center">
                    <h2 className="text-4xl font-bold mb-10">
                        Start grading with Gradeflow today.
                    </h2>
                    <Button
                        href="/signup"
                        color="primary"
                        size="lg"
                    >
                        Create your free account
                    </Button>
                </section>
            </main>
        </div>
    );
}

function Feature({ icon, title, description }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition min-h-52 flex flex-col justify-center gap-4">
            <h3 className="text-xl font-semibold">{icon} {title}</h3>
            <p className="text-gray-600 ">{description}</p>
        </div>
    );
}

function Step({ index, description}){
    return <li className="flex gap-4 text-xl">
        <span className="font-deco text-4xl">{index}.</span> {description}
    </li>
}