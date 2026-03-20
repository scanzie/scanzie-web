import Faq from "@/components/home/Faq";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="mt-[72px]">
        <Hero />
        <Features />
        <Pricing />
        <Faq />
        <Footer />
      </div>
    </div>
  );
}
