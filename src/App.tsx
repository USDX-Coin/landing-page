import { MotionConfig } from "motion/react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhyUsdx from "./components/WhyUsdx";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Ecosystem from "./components/Ecosystem";
import Faq from "./components/Faq";
import Footer from "./components/Footer";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white">
        <Navbar />
        <Hero />
        <WhyUsdx />
        <Features />
        <HowItWorks />
        <Ecosystem />
        <Faq />
        <Footer />
      </div>
    </MotionConfig>
  );
}
