import {HeaderNavigationBase} from "@/components/application/app-navigation/header-navigation";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Privacy Policy — Gradeflow",
    description: "Gradeflow privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPolicy() {
    return (
        <div>
            <HeaderNavigationBase items={[
                {label: "Pricing", href: "/pricing"},
            ]}/>

            <main className="bg-white py-20 px-6">
                <article className="max-w-3xl mx-auto prose prose-gray">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
                    <p className="text-sm text-gray-400 mb-10">Last updated: March 16, 2026</p>

                    <p>
                        Gradeflow ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy
                        explains how we collect, use, disclose, and safeguard your information when you use our
                        web application at <strong>gradeflow.xyz</strong> (the "Service").
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">1. Information We Collect</h2>

                    <h3 className="text-lg font-semibold mt-6 mb-2">1.1 Information You Provide</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li><strong>Account information</strong> — name, email address, and password when you create an account.</li>
                        <li><strong>Assignment & submission data</strong> — assignments you create, rubrics, deliverables, student submissions, and any files uploaded.</li>
                        <li><strong>Feedback content</strong> — voice recordings, transcripts, and written feedback you provide for student work.</li>
                        <li><strong>Communications</strong> — any messages you send us through support or email.</li>
                    </ul>

                    <h3 className="text-lg font-semibold mt-6 mb-2">1.2 Information Collected Automatically</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li><strong>Usage data</strong> — pages visited, features used, timestamps, and referring URLs.</li>
                        <li><strong>Device information</strong> — browser type, operating system, and screen resolution.</li>
                        <li><strong>Analytics</strong> — we use Vercel Analytics to collect anonymized performance and usage metrics.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>Provide, operate, and maintain the Service.</li>
                        <li>Process and store assignments, submissions, and feedback.</li>
                        <li>Generate AI-powered transcript summaries from your voice recordings.</li>
                        <li>Send transactional emails such as email verification, password resets, and submission notifications.</li>
                        <li>Improve, personalize, and expand the Service.</li>
                        <li>Monitor and analyze usage trends to improve user experience.</li>
                        <li>Detect, prevent, and address technical issues or abuse.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">3. Third-Party Services</h2>
                    <p>We use the following third-party services to operate Gradeflow:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li><strong>Firebase (Google)</strong> — authentication, database, and hosting.</li>
                        <li><strong>AssemblyAI</strong> — audio transcription and AI-powered summarization.</li>
                        <li><strong>Vercel</strong> — hosting and analytics.</li>
                    </ul>
                    <p className="mt-2 text-gray-600">
                        These providers have their own privacy policies governing how they handle your data.
                        We only share the minimum information necessary for each service to function.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">4. Data Storage & Security</h2>
                    <p className="text-gray-600">
                        Your data is stored in Firebase (Google Cloud) servers. We use industry-standard security
                        measures including encrypted connections (HTTPS/TLS), Firebase Authentication, and
                        Firestore Security Rules to protect your information. However, no method of electronic
                        storage is 100% secure, and we cannot guarantee absolute security.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">5. Data Retention</h2>
                    <p className="text-gray-600">
                        We retain your account and assignment data for as long as your account is active. If you
                        delete your account, we will delete your personal data within 30 days, except where we are
                        required to retain it for legal or compliance purposes.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">6. Your Rights</h2>
                    <p className="text-gray-600">Depending on your location, you may have the right to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>Access the personal data we hold about you.</li>
                        <li>Request correction of inaccurate data.</li>
                        <li>Request deletion of your data.</li>
                        <li>Object to or restrict processing of your data.</li>
                        <li>Request a portable copy of your data.</li>
                    </ul>
                    <p className="mt-2 text-gray-600">
                        To exercise any of these rights, contact us at <a href="mailto:privacy@gradeflow.xyz" className="text-[var(--color-brand-500)] underline">privacy@gradeflow.xyz</a>.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">7. Children's Privacy</h2>
                    <p className="text-gray-600">
                        Gradeflow is intended for use by educators and students aged 13 and older. We do not
                        knowingly collect personal information from children under 13. If you believe a child
                        under 13 has provided us with personal data, please contact us and we will delete it promptly.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">8. Cookies</h2>
                    <p className="text-gray-600">
                        We use essential cookies and local storage required for authentication and session
                        management. We do not use advertising or third-party tracking cookies.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">9. Changes to This Policy</h2>
                    <p className="text-gray-600">
                        We may update this Privacy Policy from time to time. We will notify you of any material
                        changes by posting the new policy on this page and updating the "Last updated" date.
                        Your continued use of the Service after changes are posted constitutes your acceptance
                        of the revised policy.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">10. Contact Us</h2>
                    <p className="text-gray-600">
                        If you have any questions about this Privacy Policy, please contact us at{" "}
                        <a href="mailto:privacy@gradeflow.xyz" className="text-[var(--color-brand-500)] underline">privacy@gradeflow.xyz</a>.
                    </p>
                </article>
            </main>

            <Footer/>
        </div>
    );
}

