import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { WhyNyiurNanggroe } from "@/components/home/WhyNyiurNanggroe";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { AIExperience } from "@/components/home/AIExperience";
import { HowItWorks } from "@/components/home/HowItWorks";
import { EnvironmentalImpact } from "@/components/home/EnvironmentalImpact";
import { Education } from "@/components/home/Education";
import { TopMitraNyiur } from "@/components/home/TopMitraNyiur";
import { Testimonial } from "@/components/home/Testimonial";
import { CallToAction } from "@/components/home/CallToAction";

export const metadata: Metadata = {
  title: "Nyiur Nanggroe — Marketplace Ekonomi Sirkular Berbasis AI",
  description:
    "Marketplace berbasis AI untuk industri kelapa. Temukan, terhubung, dan bertransaksi produk kelapa berkelanjutan.",
  openGraph: {
    title: "Nyiur Nanggroe — Marketplace Ekonomi Sirkular Kelapa Berbasis AI",
    description:
      "Mengubah limbah kelapa menjadi peluang ekonomi lewat AI dan keberlanjutan.",
  },
};

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* 1. Hero */}
        <HeroSection />

        {/* 2. Why */}
        <WhyNyiurNanggroe />

        {/* 3. Categories */}
        <FeaturedCategories />

        {/* 4. Products */}
        <FeaturedProducts />

        {/* 5. AI Experience */}
        <AIExperience />

        {/* 6. How It Works */}
        <HowItWorks />

        {/* 7. Impact */}
        <EnvironmentalImpact />

        {/* 8. Education */}
        <Education />

        {/* 9. Top Mitra */}
        <TopMitraNyiur />

        {/* 10. Testimonial */}
        <Testimonial />

        {/* 11. CTA */}
        <CallToAction />
      </main>
      
      {/* 12. Footer */}
      <Footer />
    </>
  );
}
