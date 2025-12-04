import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NewsSection from "@/components/NewsSection";
import SocialMediaSection from "@/components/SocialMediaSection";
import MerchSection from "@/components/MerchSection";
import AIAgent from "@/components/AIAgent";
import Footer from "@/components/Footer";
import SplashIntro from "@/components/SplashIntro";

const Index = () => {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SplashIntro onComplete={() => setShowContent(true)} />
      
      {showContent && (
        <>
          <Navbar />
          <main>
            <HeroSection />
            <NewsSection />
            <SocialMediaSection />
            <MerchSection />
          </main>
          <Footer />
          <AIAgent />
        </>
      )}
    </div>
  );
};

export default Index;
