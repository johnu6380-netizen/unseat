import Link from "next/link";
import EmailLink from "@/components/legal/EmailLink";

export const metadata = {
  title: "Terms of Service — Unseat",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10">
          <Link href="/" className="text-sm text-[#7C9A6B] hover:underline">
            ← Back to Unseat
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-[#2F3B2F] mb-2">Terms of Service</h1>
        <p className="text-[#8A9A7E] text-sm mb-10">Effective date: July 1, 2025</p>

        <div className="space-y-8 text-[#3D4A37] text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Unseat (&ldquo;the Service,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
              or &ldquo;our&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;).
              If you do not agree, do not use the Service. These Terms constitute a legally binding agreement
              between you and Unseat.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">2. Description of Service</h2>
            <p className="mb-3">
              Unseat provides a corrective exercise planning platform that generates personalized movement
              routines based on a self-reported overhead squat assessment and automatically schedules those
              routines as events in your Google Calendar. The Service is designed for general wellness and
              movement education purposes only.
            </p>
            <div className="bg-[#EEF3E8] rounded-xl px-4 py-3 font-medium text-[#2F3B2F]">
              NOT MEDICAL ADVICE: The Service and all content provided through it are for informational and
              general wellness purposes only. Nothing on Unseat constitutes medical advice, diagnosis, or
              treatment. Always consult a qualified physician or licensed healthcare provider before beginning
              any exercise program, particularly if you have pre-existing medical conditions, injuries, or
              physical limitations.
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">3. Eligibility</h2>
            <p>
              You must be at least 18 years of age to use the Service. By using the Service, you represent
              and warrant that you are 18 or older and have the legal capacity to enter into a binding agreement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">4. Account Registration</h2>
            <p className="mb-3">
              The Service uses Google OAuth for authentication. By signing in with your Google account, you
              authorize Unseat to access your Google profile information and, with your explicit permission,
              to create and manage events in your Google Calendar on your behalf.
            </p>
            <p>
              You are responsible for maintaining the security of your Google account credentials and for all
              activity that occurs through your Unseat account. Notify us immediately
              at <EmailLink address="legal@unseat.app" /> if you suspect unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">5. Free Trial</h2>
            <p>
              Upon creating an account and completing the initial assessment, you will receive a free trial
              period of seven (7) calendar days. No credit card is required to begin the free trial. At the
              end of the free trial period, access to plan generation, schedule creation, and Google Calendar
              synchronization will be suspended until you subscribe to a paid plan. Your existing data will
              be retained during any suspension period.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">6. Subscription and Payment</h2>
            <p className="mb-3">
              Following the free trial period, continued access to the full Service requires a paid subscription
              at the then-current rate (currently $45.00 USD per month). Subscription fees are billed monthly
              in advance and are non-refundable except as required by applicable law or as expressly stated in
              these Terms.
            </p>
            <p className="mb-3">
              All payments are processed by Stripe, Inc. By subscribing, you agree to provide accurate payment
              information and authorize Unseat to charge your payment method on a recurring monthly basis until
              you cancel. You agree to Stripe&rsquo;s terms of service, available at stripe.com/legal.
            </p>
            <p>
              Your subscription will automatically renew each month unless cancelled. You may cancel at any time
              through your account settings or by contacting us. Cancellation takes effect at the end of the
              current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">7. Refund Policy</h2>
            <p>
              Given that the Service provides immediate access to a personalized exercise plan upon subscription,
              monthly fees are generally non-refundable. We evaluate refund requests on a case-by-case basis.
              To request a refund, contact us at <EmailLink address="support@unseat.app" /> within 7 days of
              a charge.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">
              8. Assumption of Risk and Physical Activity Disclaimer
            </h2>
            <p className="mb-3">
              Physical exercise, including corrective exercise, carries inherent risks including but not limited
              to musculoskeletal injury, cardiovascular events, falls, and aggravation of pre-existing conditions.
              By using the Service, you acknowledge and voluntarily assume all risks associated with participating
              in any exercise program generated by Unseat.
            </p>
            <p className="mb-3">
              The exercise recommendations provided by Unseat are based on general corrective exercise principles
              derived from the NASM Corrective Exercise Continuum and are not individualized medical or physical
              therapy recommendations. They do not account for your full medical history, any diagnosed conditions,
              or individual physical limitations that you have not disclosed.
            </p>
            <p>
              You are solely responsible for determining whether any exercise is appropriate for your health and
              fitness level. If you experience pain, dizziness, shortness of breath, or any unusual symptom during
              exercise, stop immediately and consult a healthcare professional.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">9. Limitation of Liability</h2>
            <p className="mb-3">
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, UNSEAT AND ITS OWNERS, OFFICERS, EMPLOYEES,
              AGENTS, LICENSORS, AND SERVICE PROVIDERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
              CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR PERSONAL
              INJURY, BODILY INJURY, DEATH, LOSS OF PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION, ARISING OUT
              OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE THE SERVICE, EVEN IF ADVISED OF THE
              POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              IN NO EVENT SHALL UNSEAT&rsquo;S TOTAL CUMULATIVE LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE GREATER
              OF (A) THE TOTAL AMOUNT YOU PAID TO UNSEAT IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM OR
              (B) ONE HUNDRED DOLLARS ($100.00 USD).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">10. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF
              ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. UNSEAT DOES NOT WARRANT
              THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">11. Intellectual Property</h2>
            <p>
              All content, software, trademarks, service marks, logos, and other intellectual property on the
              Service are owned by or licensed to Unseat. You are granted a limited, non-exclusive,
              non-transferable license to use the Service for your personal, non-commercial purposes. You may
              not copy, reproduce, modify, distribute, or create derivative works from any part of the Service
              without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">12. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time, with or
              without notice, for conduct that violates these Terms or is harmful to other users, us, or third
              parties, or for any other reason at our sole discretion. Sections 8, 9, 10, and 13 survive
              termination.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">13. Governing Law and Dispute Resolution</h2>
            <p className="mb-3">
              These Terms are governed by the laws of the Commonwealth of Massachusetts, without regard to
              conflict of law principles. Disputes shall be resolved by binding arbitration administered by the
              American Arbitration Association under its Consumer Arbitration Rules, conducted in Massachusetts.
            </p>
            <p>
              YOU AND UNSEAT AGREE THAT EACH MAY BRING CLAIMS ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT
              AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">14. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify you of material changes
              by updating the effective date above and, where appropriate, by email. Your continued use of the
              Service after changes become effective constitutes your acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#2F3B2F] mb-2">15. Contact</h2>
            <p>Questions about these Terms may be directed to <EmailLink address="legal@unseat.app" />.</p>
          </section>

        </div>
      </div>
    </main>
  );
}
