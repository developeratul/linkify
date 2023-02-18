import { SEO } from "@/components/common/SEO";
import Hero from "@/components/home/Hero";
import TopBar from "@/components/home/TopBar";
import * as Chakra from "@chakra-ui/react";
import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <Chakra.Box>
      <SEO
        title="Home"
        description="LinkVault enables you to showcase your links in one single profile while being able to collect testimonials and run your newsletter"
      />
      <Chakra.Box
        backgroundImage="/hero-bg.svg"
        backgroundPosition="center"
        backgroundSize="cover"
        fontFamily="monospace"
        fontWeight="light"
      >
        <TopBar />
        <Hero />
      </Chakra.Box>
    </Chakra.Box>
  );
};

export default Home;
