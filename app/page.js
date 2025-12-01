"use client"; // because we’re using hooks + fetch

import {HeaderNavigationBase} from "@/components/application/app-navigation/header-navigation";
import {Button} from "@/components/base/buttons/button";
import {Bell01, LayoutGrid01, Microphone01} from "@untitledui/icons";
import gsap from "gsap";
import Image from "next/image";
import {useEffect, useRef} from "react";

export default function HomePage() {
    const micImage = useRef(null);
    const speechImg = useRef(null);

    useEffect(() => {
        gsap.to(micImage.current, {
            y: 20,
            duration: 3,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        });
        gsap.to(speechImg.current, {
            y: -15,
            duration: 3.5,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        })
    }, []);

    return (
        <div>
            <HeaderNavigationBase
                items={[]}
            />

            <main className="flex flex-col items-center min-h-screen bg-white">
                {/* Hero */}
                <section className="bg-gray-50 w-full py-24 px-6 max-sm:py-8">
                    <div className="grid grid-cols-2 items-center gap-8 max-w-7xl mx-auto max-sm:grid-cols-1">
                        <div className="max-sm:text-center">
                            <h1 className="text-5xl font-bold tracking-tight mb-8">
                                An <span className="select-none font-deco text-[var(--color-secondary-500)] transition-transform duration-300 ease-in-out hover:[transform:rotate(5deg)] inline-block ">educator</span>-first,<br/> <span className="select-none font-deco text-[var(--color-secondary-500)] transition-transform duration-300 ease-in-out hover:[transform:rotate(5deg)] inline-block">AI</span> -powered grading tool.
                            </h1>
                            <p className="text-lg text-gray-600 max-w-xl mb-8">
                                See how Gradeflow helps you organize submissions, give meaningful feedback, and save hours of time.<br/><br/>
                                <b>Your first assignment is completely free</b> — no credit card, no setup friction. Just create, teach, and flow.
                            </p>
                            <div className="flex gap-4 max-sm:justify-center">
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
                            {/*<div className="mt-16 flex justify-center">*/}
                            {/*    <Image*/}
                            {/*        src="/demo.png"*/}
                            {/*        alt="Gradeflow dashboard"*/}
                            {/*        width={900}*/}
                            {/*        height={500}*/}
                            {/*        className="rounded-2xl shadow-xl rounded-lg"*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </div>
                        <div className="grid grid-cols-2">
                            <img src="/microphone_1.png" alt="Microphone" ref={micImage}/>
                            <img src="/speech_bubble_1.png" alt="Speech bubble" ref={speechImg}/>
                        </div>
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
                <section className="bg-gray-50 w-full py-20 px-6 text-left">
                    <h2 className="text-5xl font-semibold mb-8 text-center">
                        How it works
                    </h2>
                    <ol className="space-y-8 font-medium max-w-2xl mx-auto">
                        <Step index={1} description="Teachers create an assignment and share a link with students." />
                        <Step index={2} description="Students submit their assignments and teachers can provide feedback via voice or text." />
                        <Step index={3} description="Teachers can review submissions, generate summaries, submit feedback to students, and manage assignments." />
                    </ol>
                </section>

                {/* CTA */}
                <section className="py-20 w-full text-center min-h-96 flex flex-col justify-center items-center gap-8">
                    <h2 className="text-5xl font-bold">
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
            <p className="text-gray-600 text-lg">{description}</p>
        </div>
    );
}

function Step({ index, description}){
    return <li className="flex gap-4 text-lg text-gray-600">
        <span className="font-deco text-4xl">{index}.</span> {description}
    </li>
}