"use client";

import {HeaderNavigationBase} from "@/components/application/app-navigation/header-navigation";
import {Button} from "@/components/base/buttons/button";
import {CheckCircle} from "@untitledui/icons";
import Footer from "@/components/Footer";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for trying Gradeflow with your first assignment.",
        cta: "Get started",
        ctaHref: "/signup",
        ctaColor: "secondary",
        highlighted: false,
        features: [
            "1 assignment",
            "Unlimited students per assignment",
            "Voice & text feedback",
            "AI-powered transcript summaries",
            "Email notifications",
        ],
    },
    {
        name: "Pro",
        price: "$9",
        period: "/month",
        description: "For educators who grade regularly and want the full toolkit.",
        cta: "Start free trial",
        ctaHref: "/signup",
        ctaColor: "primary",
        highlighted: true,
        features: [
            "Unlimited assignments",
            "Unlimited students per assignment",
            "Voice & text feedback",
            "AI-powered transcript summaries",
            "Custom rubrics",
            "Email notifications",
            "Priority support",
        ],
    },
    {
        name: "Department",
        price: "$39",
        period: "/month",
        description: "For teams and departments that need shared workflows.",
        cta: "Contact us",
        ctaHref: "mailto:hello@gradeflow.xyz",
        ctaColor: "secondary",
        highlighted: false,
        features: [
            "Everything in Pro",
            "Up to 10 instructor seats",
            "Shared rubric library",
            "Department-wide analytics",
            "Admin dashboard",
            "Dedicated onboarding",
        ],
    },
];

const faqs = [
    {
        question: "Is the free plan really free?",
        answer: "Yes — no credit card required. You can create one full assignment, invite unlimited students, and use all core features including voice feedback and AI summaries.",
    },
    {
        question: "Can I upgrade or downgrade at any time?",
        answer: "Absolutely. You can switch plans whenever you like. If you upgrade mid-cycle, we'll prorate the difference. Downgrades take effect at the end of your billing period.",
    },
    {
        question: "What counts as an assignment?",
        answer: "An assignment is a single grading task you create — for example, a project, essay, or presentation. Each assignment can have unlimited student submissions.",
    },
    {
        question: "Do students need an account?",
        answer: "Students only need the submission link you share with them. They don't need to create an account to submit their work.",
    },
    {
        question: "How does the free trial for Pro work?",
        answer: "When you sign up for Pro you get a 14-day free trial with full access. You won't be charged until the trial ends, and you can cancel anytime before that.",
    },
];

export default function PricingPage() {
    return (
        <div>
            <HeaderNavigationBase items={[
                { label: "Pricing", href: "/pricing", current: true },
            ]} />

            <main className="flex flex-col items-center bg-white">
                {/* Hero */}
                <section className="bg-gray-50 w-full py-20 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-5xl font-bold tracking-tight mb-4">
                            Simple, transparent pricing
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl mx-auto">
                            Your first assignment is completely free. Upgrade when you're ready — no surprises.
                        </p>
                    </div>
                </section>

                {/* Pricing cards */}
                <section className="w-full py-20 px-6">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-start">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`rounded-2xl p-8 flex flex-col gap-6 ${
                                    plan.highlighted
                                        ? "bg-white ring-2 ring-[var(--color-brand-500)] shadow-xl"
                                        : "bg-white ring-1 ring-gray-200 shadow-sm"
                                }`}
                            >
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold tracking-tight text-gray-900">
                                            {plan.price}
                                        </span>
                                        <span className="text-sm text-gray-500">{plan.period}</span>
                                    </div>
                                    <p className="mt-3 text-sm text-gray-500">{plan.description}</p>
                                </div>

                                <Button
                                    href={plan.ctaHref}
                                    color={plan.ctaColor}
                                    size="lg"
                                    className="w-full"
                                >
                                    {plan.cta}
                                </Button>

                                <ul className="flex flex-col gap-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                                            <CheckCircle className="size-5 shrink-0 text-[var(--color-brand-500)]" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section className="bg-gray-50 w-full py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-semibold text-center mb-12">
                            Frequently asked questions
                        </h2>
                        <dl className="flex flex-col gap-8">
                            {faqs.map((faq) => (
                                <div key={faq.question}>
                                    <dt className="text-base font-semibold text-gray-900">{faq.question}</dt>
                                    <dd className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.answer}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 w-full text-center flex flex-col justify-center items-center gap-4">
                    <h2 className="text-4xl font-bold mb-2">Ready to enter the grading flow?</h2>
                    <p className="text-lg text-gray-600 mb-4">Start with your first assignment — completely free.</p>
                    <Button href="/signup" color="primary" size="lg">
                        Create your free account
                    </Button>
                </section>
            </main>

            <Footer />
        </div>
    );
}


