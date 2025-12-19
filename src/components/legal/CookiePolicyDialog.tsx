import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CookiePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CookiePolicyDialog = ({ open, onOpenChange }: CookiePolicyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-display">Cookie Policy</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] px-6 pb-6">
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm italic">
              Effective Date: December 2024<br />
              Last Updated: December 2024
            </p>

            <section>
              <h3 className="text-lg font-semibold text-foreground">1. Introduction</h3>
              <p>
                This Cookie Policy explains how Menlifoot ("we," "us," "our") uses cookies and similar tracking technologies when you visit our website and use our services. This policy should be read in conjunction with our Privacy Policy.
              </p>
              <p>
                We are committed to transparency about the technologies we use in compliance with Canadian privacy legislation, including the Personal Information Protection and Electronic Documents Act (PIPEDA), Quebec's Act Respecting the Protection of Personal Information in the Private Sector, and Law 25 (Bill 64).
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">2. What Are Cookies?</h3>
              <p>
                Cookies are small text files that are placed on your device (computer, tablet, smartphone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information about how their sites are used.
              </p>
              <p>
                Cookies can be "session cookies" (deleted when you close your browser) or "persistent cookies" (remain on your device for a set period or until you delete them).
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">3. Types of Cookies We Use</h3>
              
              <h4 className="text-md font-medium text-foreground mt-4">3.1 Strictly Necessary Cookies</h4>
              <p>
                These cookies are essential for the operation of our website and cannot be switched off. They are usually set in response to your actions, such as setting your privacy preferences, logging in, or filling in forms. These cookies do not store any personally identifiable information.
              </p>
              <table className="w-full text-sm border-collapse border border-border mt-2">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left">Cookie Name</th>
                    <th className="border border-border p-2 text-left">Purpose</th>
                    <th className="border border-border p-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2">session_id</td>
                    <td className="border border-border p-2">Maintains user session</td>
                    <td className="border border-border p-2">Session</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">csrf_token</td>
                    <td className="border border-border p-2">Security protection</td>
                    <td className="border border-border p-2">Session</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">cookie_consent</td>
                    <td className="border border-border p-2">Stores cookie preferences</td>
                    <td className="border border-border p-2">1 year</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="text-md font-medium text-foreground mt-4">3.2 Performance/Analytics Cookies</h4>
              <p>
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us understand which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous.
              </p>
              <table className="w-full text-sm border-collapse border border-border mt-2">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left">Cookie Name</th>
                    <th className="border border-border p-2 text-left">Purpose</th>
                    <th className="border border-border p-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2">_ga</td>
                    <td className="border border-border p-2">Google Analytics - Distinguishes users</td>
                    <td className="border border-border p-2">2 years</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">_gid</td>
                    <td className="border border-border p-2">Google Analytics - Distinguishes users</td>
                    <td className="border border-border p-2">24 hours</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">_gat</td>
                    <td className="border border-border p-2">Google Analytics - Throttle requests</td>
                    <td className="border border-border p-2">1 minute</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="text-md font-medium text-foreground mt-4">3.3 Functionality Cookies</h4>
              <p>
                These cookies enable the website to provide enhanced functionality and personalization, such as remembering your language preferences or the region you are in. If you do not allow these cookies, some or all of these features may not function properly.
              </p>
              <table className="w-full text-sm border-collapse border border-border mt-2">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left">Cookie Name</th>
                    <th className="border border-border p-2 text-left">Purpose</th>
                    <th className="border border-border p-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2">language</td>
                    <td className="border border-border p-2">Remembers language preference</td>
                    <td className="border border-border p-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">theme</td>
                    <td className="border border-border p-2">Remembers dark/light mode preference</td>
                    <td className="border border-border p-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">audio_prefs</td>
                    <td className="border border-border p-2">Remembers audio/podcast preferences</td>
                    <td className="border border-border p-2">6 months</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="text-md font-medium text-foreground mt-4">3.4 Targeting/Advertising Cookies</h4>
              <p>
                These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites. They do not store directly personal information but are based on uniquely identifying your browser and internet device.
              </p>
              <table className="w-full text-sm border-collapse border border-border mt-2">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="border border-border p-2 text-left">Cookie Name</th>
                    <th className="border border-border p-2 text-left">Purpose</th>
                    <th className="border border-border p-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2">_fbp</td>
                    <td className="border border-border p-2">Facebook - Advertising and analytics</td>
                    <td className="border border-border p-2">3 months</td>
                  </tr>
                  <tr>
                    <td className="border border-border p-2">fr</td>
                    <td className="border border-border p-2">Facebook - Ad delivery and measurement</td>
                    <td className="border border-border p-2">3 months</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">4. Similar Technologies</h3>
              <p>
                In addition to cookies, we may use similar technologies including:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Web Beacons:</strong> Small graphic images (also known as "pixel tags" or "clear GIFs") used to track user behavior and measure campaign effectiveness</li>
                <li><strong>Local Storage:</strong> Technology that allows websites to store data locally in your browser, similar to cookies but with larger storage capacity</li>
                <li><strong>Session Storage:</strong> Similar to local storage but data is cleared when the browser session ends</li>
                <li><strong>Fingerprinting:</strong> Techniques that collect information about your device configuration to create a unique identifier</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">5. Third-Party Cookies</h3>
              <p>
                Some cookies on our site are set by third-party services that appear on our pages. We do not control these third-party cookies. The third parties that set cookies include:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Google Analytics:</strong> Web analytics service to analyze website traffic</li>
                <li><strong>YouTube:</strong> Video hosting platform for embedded video content</li>
                <li><strong>Social Media Platforms:</strong> Facebook, Twitter, Instagram for social sharing features</li>
                <li><strong>Spotify:</strong> For embedded podcast players</li>
                <li><strong>Payment Processors:</strong> For secure transaction processing</li>
              </ul>
              <p className="mt-2">
                Please review the privacy policies of these third parties to understand how they use cookies and your data.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">6. Your Cookie Choices and Rights</h3>
              <p>
                Under Quebec Law 25 and PIPEDA, you have the right to control how cookies are used on your device. You can manage your cookie preferences in several ways:
              </p>

              <h4 className="text-md font-medium text-foreground mt-4">6.1 Cookie Consent Banner</h4>
              <p>
                When you first visit our site, you will see a cookie consent banner allowing you to accept or reject non-essential cookies. You can change your preferences at any time through our cookie settings.
              </p>

              <h4 className="text-md font-medium text-foreground mt-4">6.2 Browser Settings</h4>
              <p>
                Most browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Block all cookies</li>
                <li>Block only third-party cookies</li>
                <li>Delete cookies when you close your browser</li>
                <li>Receive alerts before cookies are placed</li>
              </ul>
              <p className="mt-2">
                Please note that blocking or deleting cookies may affect your experience on our website and limit certain functionalities.
              </p>

              <h4 className="text-md font-medium text-foreground mt-4">6.3 Opt-Out Tools</h4>
              <p>
                You can opt out of certain third-party cookies using:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Google Analytics Opt-out Browser Add-on: tools.google.com/dlpage/gaoptout</li>
                <li>Digital Advertising Alliance of Canada (DAAC): youradchoices.ca</li>
                <li>Network Advertising Initiative (NAI): optout.networkadvertising.org</li>
              </ul>

              <h4 className="text-md font-medium text-foreground mt-4">6.4 Do Not Track Signals</h4>
              <p>
                Some browsers include a "Do Not Track" (DNT) feature that sends a signal to websites you visit indicating you do not wish to be tracked. We currently do not respond to DNT signals, but we respect your other cookie choices as described above.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">7. Consent Under Quebec Law 25</h3>
              <p>
                In accordance with Quebec's Law 25 requirements:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>We obtain express consent before placing non-essential cookies on your device</li>
                <li>We provide clear information about the types of cookies used and their purposes</li>
                <li>We allow you to withdraw your consent at any time</li>
                <li>We do not use "dark patterns" or manipulative design to obtain consent</li>
                <li>We keep records of consent for audit purposes</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">8. Cookie Retention Periods</h3>
              <p>
                Cookie retention periods vary based on their type and purpose:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain for their specified duration (ranging from 24 hours to 2 years)</li>
                <li><strong>Third-Party Cookies:</strong> Subject to the retention policies of the respective third parties</li>
              </ul>
              <p className="mt-2">
                We regularly review our cookie usage and retention periods to ensure they remain appropriate and necessary.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">9. Impact of Disabling Cookies</h3>
              <p>
                If you choose to disable cookies, please be aware that:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Some features of our website may not function properly</li>
                <li>You may need to re-enter information on each visit</li>
                <li>Your preferences and settings may not be remembered</li>
                <li>You may still see advertisements, but they will be less relevant to you</li>
                <li>Some embedded content (videos, social media) may not display correctly</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">10. Updates to This Cookie Policy</h3>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. When we make material changes, we will:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Update the "Last Updated" date at the top of this policy</li>
                <li>Post the updated policy on our website</li>
                <li>Where appropriate, notify you through our website or other means</li>
              </ul>
              <p className="mt-2">
                We encourage you to review this Cookie Policy periodically to stay informed about our use of cookies.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">11. Contact Us</h3>
              <p>
                If you have questions about our use of cookies or this Cookie Policy, please contact us through our official social media channels or platform communication features.
              </p>
              <p className="mt-2">
                <strong>Location:</strong> Montreal, Quebec, Canada
              </p>
              <p className="mt-2">
                You may also file a complaint with the Commission d'accès à l'information du Québec (CAI) if you have concerns about our cookie practices.
              </p>
            </section>

            <section className="border-t border-border pt-4 mt-6">
              <p className="text-xs text-muted-foreground">
                This Cookie Policy is governed by the laws of Quebec and Canada.<br />
                © 2024 Menlifoot. All rights reserved.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CookiePolicyDialog;
