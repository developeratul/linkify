import { SEO } from "@/components/common/SEO";
import * as Chakra from "@chakra-ui/react";
import { type NextPage } from "next";
import dynamic from "next/dynamic";
const Author = dynamic(() => import("@/components/home/Author"));
const FAQ = dynamic(() => import("@/components/home/FAQ"));
const FeaturesSection = dynamic(() => import("@/components/home/Features"));
const Footer = dynamic(() => import("@/components/home/Footer"));
const Hero = dynamic(() => import("@/components/home/Hero"));
const TopBar = dynamic(() => import("@/components/home/TopBar"));
const UseCase = dynamic(() => import("@/components/home/UseCase"));
const Arrival = dynamic(() => import("@/components/home/Arrival"));

const Home: NextPage = () => {
  return (
    <Chakra.Box fontFamily="monospace" fontWeight="light" bg="purple.50">
      <SEO title="Home" description="Connect with your audience with just one link using Linkify" />
      <TopBar />
      <Chakra.Box
        bgPosition="center"
        backgroundImage="/hero-bg.svg"
        backgroundPosition="center"
        backgroundSize="cover"
      >
        <Hero />
      </Chakra.Box>
      <FeaturesSection />
      <UseCase />
      <Arrival />
      <Author />
      <FAQ />
      <Footer />
    </Chakra.Box>
  );
};

export default Home;
