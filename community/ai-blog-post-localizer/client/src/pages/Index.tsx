import Navbar from "../component/Navbar";
import HeroSection from "../component/HeroSection"
import FeaturesSection from "../component/FeaturesSection";
import HowItWorksSection from "../component/HowItWorksSection";
import CTASection from "../component/CTASection";
import Footer from "../component/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
