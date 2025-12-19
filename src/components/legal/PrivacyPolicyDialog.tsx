import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyPolicyDialog = ({ open, onOpenChange }: PrivacyPolicyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-display">Privacy Policy</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] px-6 pb-6">
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground [&_strong]:text-primary [&_li_strong]:text-primary">
            <p className="text-sm italic">
              Effective Date: December 2024<br />
              Last Updated: December 2024
            </p>

            <section>
              <h3 className="text-lg font-semibold text-foreground">1. Introduction</h3>
              <p>
                Menlifoot ("we," "us," "our") is committed to protecting the privacy and personal information of our users in accordance with Canadian federal privacy legislation, including the Personal Information Protection and Electronic Documents Act (PIPEDA), Quebec's Act Respecting the Protection of Personal Information in the Private Sector (Quebec Privacy Act), and Law 25 (Bill 64) amendments.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, use our services, or interact with our platform. By using Menlifoot, you consent to the practices described in this policy.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">2. Personal Information We Collect</h3>
              <p>We may collect the following categories of personal information:</p>
              
              <h4 className="text-md font-medium text-foreground mt-4">2.1 Information You Provide Directly</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Account Information:</strong> Email address, username, password when creating an account</li>
                <li><strong>Profile Information:</strong> Name, profile picture, preferences</li>
                <li><strong>Communication Data:</strong> Messages, comments, feedback you submit</li>
                <li><strong>Newsletter Subscriptions:</strong> Email address for marketing communications</li>
                <li><strong>Payment Information:</strong> Billing details for merchandise purchases (processed through secure third-party payment processors)</li>
              </ul>

              <h4 className="text-md font-medium text-foreground mt-4">2.2 Information Collected Automatically</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Usage Data:</strong> Pages visited, time spent, click patterns, referring URLs</li>
                <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                <li><strong>Cookies and Tracking Technologies:</strong> As detailed in our Cookie Policy</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">3. Legal Basis and Purposes for Collection</h3>
              <p>Under Quebec's Law 25 and PIPEDA, we collect personal information for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our platform and services</li>
                <li><strong>Account Management:</strong> To create and manage user accounts, authenticate users</li>
                <li><strong>Communications:</strong> To send service-related notifications, respond to inquiries</li>
                <li><strong>Marketing:</strong> With your consent, to send promotional content and newsletters</li>
                <li><strong>Analytics:</strong> To understand usage patterns and improve user experience</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                <li><strong>Security:</strong> To detect, prevent, and address technical issues and security threats</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">4. Consent</h3>
              <p>
                In accordance with Quebec's Law 25 and PIPEDA, we obtain meaningful consent before collecting, using, or disclosing your personal information. The form of consent may vary depending on the circumstances and the sensitivity of the information.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Express Consent:</strong> Required for sensitive information, marketing communications, and sharing with third parties</li>
                <li><strong>Implied Consent:</strong> May apply when the purpose is obvious and information is not sensitive</li>
                <li><strong>Withdrawal of Consent:</strong> You may withdraw consent at any time, subject to legal or contractual restrictions</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">5. Disclosure of Personal Information</h3>
              <p>We may disclose your personal information to:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Service Providers:</strong> Third parties who perform services on our behalf (hosting, analytics, payment processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental authority</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property</li>
              </ul>
              <p className="mt-2">
                We do not sell personal information to third parties. Any disclosure to third parties is subject to contractual obligations ensuring equivalent protection.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">6. Cross-Border Transfers</h3>
              <p>
                Your personal information may be transferred to and processed in countries outside Quebec and Canada. When we transfer information internationally, we ensure appropriate safeguards are in place as required by Law 25, including:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Contractual clauses ensuring equivalent protection</li>
                <li>Assessment of the legal framework in the destination jurisdiction</li>
                <li>Implementation of appropriate technical and organizational measures</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">7. Data Retention</h3>
              <p>
                We retain personal information only as long as necessary to fulfill the purposes for which it was collected, or as required by law. Retention periods are determined based on:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The nature and sensitivity of the information</li>
                <li>The purposes for which it was collected</li>
                <li>Legal and regulatory requirements</li>
                <li>Legitimate business needs</li>
              </ul>
              <p className="mt-2">
                When personal information is no longer needed, it will be securely destroyed, erased, or anonymized.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">8. Your Rights Under Quebec Law 25 and PIPEDA</h3>
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Right of Access:</strong> Request access to personal information we hold about you</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal information (subject to legal exceptions)</li>
                <li><strong>Right to Portability:</strong> Receive your personal information in a structured, commonly used format</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw previously given consent</li>
                <li><strong>Right to Object:</strong> Object to certain processing activities</li>
                <li><strong>Right to Information:</strong> Be informed about automated decision-making processes</li>
              </ul>
              <p className="mt-2">
                To exercise these rights, please contact us using the information provided below. We will respond within 30 days as required by law.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">9. Security Measures</h3>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication mechanisms</li>
                <li>Regular security assessments and audits</li>
                <li>Access controls and employee training</li>
                <li>Incident response procedures</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">10. Privacy Incident Response</h3>
              <p>
                In accordance with Law 25, we maintain procedures to detect, assess, and respond to privacy incidents. If a privacy incident poses a risk of serious injury, we will:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Notify the Commission d'accès à l'information du Québec (CAI)</li>
                <li>Notify affected individuals as required</li>
                <li>Take measures to reduce the risk of harm</li>
                <li>Maintain a register of privacy incidents</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">11. Children's Privacy</h3>
              <p>
                Our services are not directed to individuals under 14 years of age. We do not knowingly collect personal information from children under 14. If we become aware that we have collected personal information from a child under 14 without parental consent, we will take steps to delete that information. For individuals aged 14-17, we obtain parental consent as required by applicable law.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">12. Automated Decision-Making</h3>
              <p>
                In compliance with Law 25, we inform you that we may use automated decision-making systems for:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Content personalization and recommendations</li>
                <li>Fraud detection and prevention</li>
                <li>User experience optimization</li>
              </ul>
              <p className="mt-2">
                You have the right to be informed about such decisions and to request human intervention or review of automated decisions that significantly affect you.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">13. Person Responsible for Privacy</h3>
              <p>
                In accordance with Law 25, we have designated a person responsible for the protection of personal information. This individual oversees our privacy program and can be contacted for any privacy-related inquiries or concerns.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">14. Changes to This Policy</h3>
              <p>
                We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. We will notify you of material changes by posting the updated policy on our website and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">15. Contact Information</h3>
              <p>
                For privacy-related inquiries, to exercise your rights, or to file a complaint, please contact us through our official social media channels or platform communication features.
              </p>
              <p className="mt-2">
                <strong>Location:</strong> Montreal, Quebec, Canada
              </p>
              <p className="mt-2">
                You also have the right to file a complaint with the Commission d'accès à l'information du Québec (CAI) if you believe your privacy rights have been violated.
              </p>
            </section>

            <section className="border-t border-border pt-4 mt-6">
              <p className="text-xs text-muted-foreground">
                This Privacy Policy is governed by the laws of Quebec and Canada.<br />
                © 2024 Menlifoot. All rights reserved.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyDialog;
