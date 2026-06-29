import Navbar from "./_components/Navbar";
import Hero from "./_components/Hero";
import Features from "./_components/Features";
import ToolsPreview from "./_components/ToolsPreview";
import Pricing from "./_components/Pricing";
import Footer from "./_components/Footer";
import CTA from "./_components/CTA";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <ToolsPreview />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
