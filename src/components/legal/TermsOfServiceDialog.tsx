import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsOfServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsOfServiceDialog = ({ open, onOpenChange }: TermsOfServiceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-display">Terms of Service</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] px-6 pb-6">
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground [&_strong]:text-primary [&_li_strong]:text-primary">
            <p className="text-sm italic">
              Effective Date: December 2024<br />
              Last Updated: December 2024
            </p>

            <section>
              <h3 className="text-lg font-semibold text-foreground">1. Agreement to Terms</h3>
              <p>
                Welcome to Menlifoot. These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," "your") and Menlifoot ("Company," "we," "us," "our"), a digital media platform operating from Montreal, Quebec, Canada.
              </p>
              <p>
                By accessing or using our website, mobile application, or any related services (collectively, the "Services"), you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not access or use our Services.
              </p>
              <p>
                These Terms are governed by the laws of the Province of Quebec and the federal laws of Canada applicable therein, including but not limited to the Civil Code of Quebec, the Consumer Protection Act (Quebec), the Charter of the French Language, and applicable federal legislation.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">2. Eligibility</h3>
              <p>
                To use our Services, you must:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Be at least 14 years of age. If you are between 14 and 18 years old, you must have parental or guardian consent to use our Services</li>
                <li>Have the legal capacity to enter into a binding contract under Quebec law</li>
                <li>Not be prohibited from using our Services under applicable laws</li>
                <li>Provide accurate and complete registration information</li>
              </ul>
              <p className="mt-2">
                By using our Services, you represent and warrant that you meet these eligibility requirements.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">3. Account Registration and Security</h3>
              <h4 className="text-md font-medium text-foreground mt-4">3.1 Account Creation</h4>
              <p>
                Certain features of our Services require account registration. When creating an account, you agree to provide accurate, current, and complete information and to update this information as necessary.
              </p>

              <h4 className="text-md font-medium text-foreground mt-4">3.2 Account Security</h4>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Create a strong, unique password</li>
                <li>Not share your account credentials with others</li>
                <li>Notify us immediately of any unauthorized access or use</li>
                <li>Log out of your account when using shared devices</li>
              </ul>

              <h4 className="text-md font-medium text-foreground mt-4">3.3 Account Termination</h4>
              <p>
                We reserve the right to suspend or terminate your account at our discretion, with or without notice, for violations of these Terms or for any other reason. You may also delete your account at any time.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">4. Acceptable Use Policy</h3>
              <p>
                When using our Services, you agree NOT to:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Violate any applicable federal, provincial, or local laws or regulations</li>
                <li>Infringe upon the intellectual property rights of others</li>
                <li>Post, transmit, or distribute content that is unlawful, defamatory, obscene, harassing, threatening, or otherwise objectionable</li>
                <li>Engage in hate speech or discrimination based on race, ethnicity, national origin, religion, gender, sexual orientation, disability, or any other protected characteristic</li>
                <li>Impersonate any person or entity or falsely represent your affiliation</li>
                <li>Collect or harvest personal information of other users without consent</li>
                <li>Use automated systems (bots, scrapers, crawlers) without express written permission</li>
                <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
                <li>Interfere with or disrupt the integrity or performance of our Services</li>
                <li>Transmit viruses, malware, or other harmful code</li>
                <li>Engage in any activity that could damage, disable, or impair our Services</li>
                <li>Use our Services for commercial purposes without our consent</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">5. Intellectual Property Rights</h3>
              <h4 className="text-md font-medium text-foreground mt-4">5.1 Our Content</h4>
              <p>
                All content on our platform, including but not limited to text, graphics, logos, images, audio clips, video clips, data compilations, and software ("Menlifoot Content"), is the property of Menlifoot or our licensors and is protected by Canadian and international copyright, trademark, and other intellectual property laws.
              </p>

              <h4 className="text-md font-medium text-foreground mt-4">5.2 Limited License</h4>
              <p>
                We grant you a limited, non-exclusive, non-transferable, revocable license to access and use our Services and Menlifoot Content for personal, non-commercial purposes, subject to these Terms.
              </p>

              <h4 className="text-md font-medium text-foreground mt-4">5.3 User Content</h4>
              <p>
                By submitting content to our platform ("User Content"), you:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Retain ownership of your User Content</li>
                <li>Grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content</li>
                <li>Represent that you have all necessary rights to grant this license</li>
                <li>Agree that your User Content does not violate any third-party rights</li>
              </ul>

              <h4 className="text-md font-medium text-foreground mt-4">5.4 Copyright Infringement</h4>
              <p>
                We respect intellectual property rights and expect our users to do the same. If you believe your copyright has been infringed, please contact us with the required information under the Copyright Act (Canada).
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">6. Third-Party Content and Links</h3>
              <p>
                Our Services may contain links to third-party websites, services, or content that we do not own or control. We are not responsible for:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>The content, privacy practices, or policies of third-party sites</li>
                <li>Any damage or loss caused by third-party content or services</li>
                <li>The accuracy or reliability of third-party information</li>
              </ul>
              <p className="mt-2">
                Your interactions with third parties are solely between you and the third party.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">7. E-Commerce and Purchases</h3>
              <h4 className="text-md font-medium text-foreground mt-4">7.1 Products and Services</h4>
              <p>
                We may offer merchandise, subscriptions, or other products for purchase through our platform. All purchases are subject to product availability and our acceptance of your order.
              </p>

              <h4 className="text-md font-medium text-foreground mt-4">7.2 Pricing and Payment</h4>
              <p>
                All prices are displayed in Canadian dollars unless otherwise specified and are subject to applicable taxes (GST/QST). We reserve the right to change prices at any time. Payment must be made through approved payment methods.
              </p>

              <h4 className="text-md font-medium text-foreground mt-4">7.3 Consumer Rights Under Quebec Law</h4>
              <p>
                As a consumer in Quebec, you have rights under the Consumer Protection Act, including:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Right to clear and accurate information about products and services</li>
                <li>Protection against misleading advertising</li>
                <li>Right to cancel certain contracts within prescribed time limits</li>
                <li>Protection against unfair contract terms</li>
              </ul>

              <h4 className="text-md font-medium text-foreground mt-4">7.4 Refund Policy</h4>
              <p>
                Refund requests for digital content or merchandise will be handled in accordance with our Refund Policy and applicable Quebec consumer protection laws.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">8. Disclaimers</h3>
              <p className="uppercase font-medium">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Our Services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied</li>
                <li>We do not warrant that our Services will be uninterrupted, error-free, or secure</li>
                <li>We do not warrant the accuracy, completeness, or reliability of any content</li>
                <li>We disclaim all implied warranties, including merchantability, fitness for a particular purpose, and non-infringement</li>
              </ul>
              <p className="mt-2">
                These disclaimers do not affect your statutory rights under Quebec consumer protection legislation, which cannot be excluded or limited.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">9. Limitation of Liability</h3>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, MENLIFOOT AND ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, AND AFFILIATES SHALL NOT BE LIABLE FOR:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Any indirect, incidental, special, consequential, or punitive damages</li>
                <li>Loss of profits, revenue, data, or goodwill</li>
                <li>Any damages arising from your use or inability to use our Services</li>
                <li>Any damages arising from unauthorized access to your account</li>
              </ul>
              <p className="mt-2">
                OUR TOTAL LIABILITY SHALL NOT EXCEED THE GREATER OF: (A) THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED CANADIAN DOLLARS ($100 CAD).
              </p>
              <p className="mt-2">
                Nothing in these Terms excludes or limits liability that cannot be excluded or limited under applicable law, including liability for gross negligence, intentional misconduct, or liability under Quebec consumer protection legislation.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">10. Indemnification</h3>
              <p>
                You agree to indemnify, defend, and hold harmless Menlifoot and its affiliates, directors, officers, employees, and agents from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising from:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your use of our Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of a third party</li>
                <li>Your User Content</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">11. Governing Law and Dispute Resolution</h3>
              <h4 className="text-md font-medium text-foreground mt-4">11.1 Governing Law</h4>
              <p>
                These Terms are governed by and construed in accordance with the laws of the Province of Quebec and the federal laws of Canada applicable therein, without regard to conflict of law principles.
              </p>

              <h4 className="text-md font-medium text-foreground mt-4">11.2 Jurisdiction</h4>
              <p>
                Any disputes arising from these Terms or your use of our Services shall be subject to the exclusive jurisdiction of the courts of the Province of Quebec, sitting in the judicial district of Montreal.
              </p>

              <h4 className="text-md font-medium text-foreground mt-4">11.3 Consumer Rights</h4>
              <p>
                Nothing in this section limits your rights as a consumer under the Consumer Protection Act (Quebec), including your right to bring proceedings before the courts of Quebec.
              </p>

              <h4 className="text-md font-medium text-foreground mt-4">11.4 Small Claims</h4>
              <p>
                Either party may bring claims in small claims court where eligible under applicable rules.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">12. Language</h3>
              <p>
                In accordance with the Charter of the French Language (Quebec), you have the right to receive these Terms in French. Les parties aux présentes ont expressément demandé que ce contrat et tous les documents qui s'y rattachent soient rédigés en anglais. The parties have expressly requested that this contract and all related documents be drawn up in English. Both French and English versions may be made available; in case of discrepancy, the version in the language you selected shall prevail.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">13. Modifications to Terms</h3>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes by:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Posting the updated Terms on our website</li>
                <li>Updating the "Last Updated" date</li>
                <li>Sending notice via email or platform notification for significant changes</li>
              </ul>
              <p className="mt-2">
                Your continued use of our Services after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">14. Severability</h3>
              <p>
                If any provision of these Terms is held to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its original intent.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">15. Entire Agreement</h3>
              <p>
                These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Menlifoot regarding your use of our Services and supersede all prior agreements and understandings.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">16. Contact Information</h3>
              <p>
                For questions about these Terms of Service, please contact us through our official social media channels or platform communication features.
              </p>
              <p className="mt-2">
                <strong>Location:</strong> Montreal, Quebec, Canada
              </p>
            </section>

            <section className="border-t border-border pt-4 mt-6">
              <p className="text-xs text-muted-foreground">
                These Terms of Service are governed by the laws of Quebec and Canada.<br />
                © 2024 Menlifoot. All rights reserved.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfServiceDialog;
