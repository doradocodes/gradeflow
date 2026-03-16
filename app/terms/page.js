import {HeaderNavigationBase} from "@/components/application/app-navigation/header-navigation";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Terms of Service — Gradeflow",
    description: "Gradeflow terms of service — the rules and guidelines for using our platform.",
};

export default function TermsOfService() {
    return (
        <div>
            <HeaderNavigationBase items={[
                {label: "Pricing", href: "/pricing"},
            ]}/>

            <main className="bg-white py-20 px-6">
                <article className="max-w-3xl mx-auto prose prose-gray">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Terms of Service</h1>
                    <p className="text-sm text-gray-400 mb-10">Last updated: March 16, 2026</p>

                    <p>
                        These Terms of Service ("Terms") govern your access to and use of the Gradeflow web
                        application at <strong>gradeflow.xyz</strong> (the "Service") operated by Gradeflow
                        ("we", "our", or "us"). By creating an account or using the Service, you agree to be
                        bound by these Terms.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">1. Eligibility</h2>
                    <p className="text-gray-600">
                        You must be at least 13 years old to use Gradeflow. If you are under 18, you must have
                        the consent of a parent or legal guardian. By using the Service you represent that you
                        meet these requirements.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">2. Accounts</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                        <li>You are responsible for all activity that occurs under your account.</li>
                        <li>You must provide accurate and complete information when creating an account.</li>
                        <li>You must notify us immediately of any unauthorized use of your account.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">3. Acceptable Use</h2>
                    <p className="text-gray-600">You agree not to:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>Use the Service for any unlawful purpose or in violation of any applicable laws.</li>
                        <li>Upload content that is defamatory, obscene, abusive, or infringes on the rights of others.</li>
                        <li>Attempt to gain unauthorized access to any part of the Service or its systems.</li>
                        <li>Interfere with or disrupt the integrity or performance of the Service.</li>
                        <li>Use automated systems (bots, scrapers, etc.) to access the Service without our written permission.</li>
                        <li>Impersonate another person or misrepresent your affiliation with any entity.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">4. User Content</h2>
                    <h3 className="text-lg font-semibold mt-6 mb-2">4.1 Ownership</h3>
                    <p className="text-gray-600">
                        You retain ownership of all content you upload, create, or submit through the Service,
                        including assignments, rubrics, submissions, feedback, and recordings ("User Content").
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-2">4.2 License to Gradeflow</h3>
                    <p className="text-gray-600">
                        By submitting User Content, you grant us a limited, non-exclusive, worldwide, royalty-free
                        license to store, process, and display your content solely for the purpose of providing and
                        improving the Service. We will not sell your content or use it for advertising.
                    </p>

                    <h3 className="text-lg font-semibold mt-6 mb-2">4.3 AI Processing</h3>
                    <p className="text-gray-600">
                        Voice recordings and transcripts may be processed by third-party AI services (e.g.,
                        AssemblyAI) to generate summaries and feedback. By using these features, you consent to
                        this processing. We do not use your content to train third-party AI models.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">5. Plans & Payment</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                        <li>The Free plan allows one assignment at no cost with no credit card required.</li>
                        <li>Paid plans are billed monthly. Prices are listed on our <a href="/pricing" className="text-[var(--color-brand-500)] underline">Pricing page</a>.</li>
                        <li>You may upgrade or downgrade your plan at any time. Upgrades are prorated; downgrades take effect at the end of the current billing period.</li>
                        <li>We reserve the right to change pricing with 30 days' written notice.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">6. Cancellation & Refunds</h2>
                    <p className="text-gray-600">
                        You may cancel your paid subscription at any time from your account settings. Upon
                        cancellation, you will retain access to paid features through the end of your current
                        billing period. We do not offer refunds for partial billing periods unless required by law.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">7. Intellectual Property</h2>
                    <p className="text-gray-600">
                        The Service and its original content (excluding User Content), features, and functionality
                        are owned by Gradeflow and are protected by copyright, trademark, and other intellectual
                        property laws. You may not copy, modify, distribute, or reverse-engineer any part of the
                        Service without our prior written consent.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">8. Termination</h2>
                    <p className="text-gray-600">
                        We may suspend or terminate your access to the Service at any time, with or without cause,
                        and with or without notice. Upon termination, your right to use the Service ceases
                        immediately. We may delete your data within 30 days of account termination.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">9. Disclaimer of Warranties</h2>
                    <p className="text-gray-600">
                        The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any
                        kind, whether express or implied, including but not limited to implied warranties of
                        merchantability, fitness for a particular purpose, and non-infringement. We do not warrant
                        that the Service will be uninterrupted, secure, or error-free.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">10. Limitation of Liability</h2>
                    <p className="text-gray-600">
                        To the fullest extent permitted by law, Gradeflow and its officers, directors, employees,
                        and agents shall not be liable for any indirect, incidental, special, consequential, or
                        punitive damages, or any loss of profits, data, or goodwill, arising out of or in
                        connection with your use of the Service. Our total liability shall not exceed the amount
                        you paid us in the twelve (12) months preceding the claim.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">11. Indemnification</h2>
                    <p className="text-gray-600">
                        You agree to indemnify and hold harmless Gradeflow from any claims, damages, losses, or
                        expenses (including reasonable attorney's fees) arising from your use of the Service, your
                        User Content, or your violation of these Terms.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">12. Governing Law</h2>
                    <p className="text-gray-600">
                        These Terms shall be governed by and construed in accordance with the laws of the United
                        States, without regard to conflict of law principles. Any disputes arising under these
                        Terms shall be resolved in the courts located in the applicable jurisdiction.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">13. Changes to These Terms</h2>
                    <p className="text-gray-600">
                        We reserve the right to modify these Terms at any time. We will provide notice of material
                        changes by updating the "Last updated" date at the top of this page. Your continued use of
                        the Service after changes are posted constitutes your acceptance of the revised Terms.
                    </p>

                    <h2 className="text-2xl font-semibold mt-10 mb-4">14. Contact Us</h2>
                    <p className="text-gray-600">
                        If you have any questions about these Terms, please contact us at{" "}
                        <a href="mailto:hello@gradeflow.xyz" className="text-[var(--color-brand-500)] underline">hello@gradeflow.xyz</a>.
                    </p>
                </article>
            </main>

            <Footer/>
        </div>
    );
}

