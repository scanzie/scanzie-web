import FAQ from "@/components/Faq";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="mt-[72px]">
        <Hero />
        <Features />
        <Pricing />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
}
