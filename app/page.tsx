import Faq from "@/components/home/Faq";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";
import Results from "@/components/home/Results";
import { getHomeStats } from "@/lib/actions/home";

export default async function Home() {
  const stats = await getHomeStats();

  return (
    <div>
      <Header />
      <div className="mt-[72px]">
        <Hero />
        <Results stats={stats} />
        <Features />
        <Pricing />
        <Faq />
        <Footer />
      </div>
    </div>
  );
}
