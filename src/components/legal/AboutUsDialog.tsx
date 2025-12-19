import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AboutUsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutUsDialog = ({ open, onOpenChange }: AboutUsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-display">About Menlifoot</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh] px-6 pb-6">
          <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground [&_strong]:text-primary [&_li_strong]:text-primary">
            <section>
              <h3 className="text-lg font-semibold text-foreground">Our Mission</h3>
              <p>
                Menlifoot is a premier digital media platform dedicated to bringing the passion and excitement of Haitian football to fans worldwide. Founded in Montreal, Quebec, Canada, we serve as a bridge connecting the vibrant Haitian football community across the diaspora with the latest news, analysis, and cultural content surrounding the beautiful game.
              </p>
              <p>
                Our mission is to celebrate, promote, and elevate Haitian football culture through comprehensive coverage, engaging multimedia content, and community-driven initiatives that unite fans across borders.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">Who We Are</h3>
              <p>
                Menlifoot was established in Montreal, Quebec, with a vision to become the definitive source for Haitian football content. Our team comprises passionate journalists, content creators, and football enthusiasts who share a deep love for Haitian football and its rich heritage.
              </p>
              <p>
                We operate from our headquarters in Montreal, Quebec, Canada, strategically positioned within one of the largest Haitian diaspora communities in North America. This location enables us to maintain strong connections with both the local Haitian-Canadian community and our global audience.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">Our Services</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>News Coverage:</strong> Real-time updates on Haitian football, including match reports, transfer news, and league standings from the Championnat National and international competitions.</li>
                <li><strong>Podcasts:</strong> In-depth audio content featuring expert analysis, player interviews, and discussions on topics affecting Haitian football.</li>
                <li><strong>Articles & Analysis:</strong> Comprehensive written content covering tactical breakdowns, historical retrospectives, and feature stories.</li>
                <li><strong>Multimedia Content:</strong> Engaging video content, photo galleries, and interactive features that bring fans closer to the action.</li>
                <li><strong>AI-Powered Assistance:</strong> Our innovative AI football assistant provides personalized insights and answers to your football queries.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">Our Values</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Authenticity:</strong> We are committed to authentic, accurate, and unbiased coverage of Haitian football.</li>
                <li><strong>Community:</strong> We believe in the power of community and strive to create spaces where fans can connect and share their passion.</li>
                <li><strong>Excellence:</strong> We pursue excellence in all our content, maintaining high journalistic standards and creative quality.</li>
                <li><strong>Accessibility:</strong> We aim to make Haitian football content accessible to fans worldwide, regardless of their location.</li>
                <li><strong>Cultural Pride:</strong> We celebrate and promote Haitian culture through the lens of football.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">Corporate Information</h3>
              <p>
                Menlifoot is a digital media platform operating under Canadian federal and Quebec provincial laws. Our operations are conducted in accordance with all applicable regulations governing digital media, consumer protection, and privacy in Canada.
              </p>
              <p>
                <strong>Business Location:</strong> Montreal, Quebec, Canada<br />
                <strong>Languages of Service:</strong> French, English, Haitian Creole<br />
                <strong>Founded:</strong> 2024
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-foreground">Contact Us</h3>
              <p>
                We welcome feedback, partnership inquiries, and collaboration opportunities. You can reach us through our social media channels or by engaging with our platform directly.
              </p>
              <p>
                For press inquiries, content partnerships, or advertising opportunities, please connect with us through our official social media channels listed on our website.
              </p>
            </section>

            <section className="border-t border-border pt-4 mt-6">
              <p className="text-xs text-muted-foreground">
                Last Updated: December 2024<br />
                © 2024 Menlifoot. All rights reserved.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AboutUsDialog;
