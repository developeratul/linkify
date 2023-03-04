import { SEO } from "@/components/common/SEO";
import Arrival from "@/components/home/Arrival";
import Author from "@/components/home/Author";
import FeaturesSection from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import TopBar from "@/components/home/TopBar";
import * as Chakra from "@chakra-ui/react";
import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Chakra.Box fontFamily="monospace" fontWeight="light" bg="purple.50">
      <SEO
        title="Home"
        description="Linkify, The app that let's you connect with your audience with just one link."
      />
      <TopBar />
      <Chakra.Box backgroundImage="/hero-bg.svg" backgroundPosition="center" backgroundSize="cover">
        <Hero />
      </Chakra.Box>
      <FeaturesSection />
      <Arrival />
      <Author />
      <Footer />
    </Chakra.Box>
  );
};

export default Home;
