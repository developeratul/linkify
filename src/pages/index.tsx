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
    <Chakra.Box fontWeight="light" bg="purple.50">
      <SEO title="Home" description="Connect with your audience with just one link using Linkify">
        <meta
          name="keywords"
          content="link in bio, Instagram bio link, social media marketing, social media optimization, clickable links, traffic generation, bio link optimization, link management, link tracking, link analytics, testimonials, newsletter, Developer API, Linkify, Forms, All in one link in bio tool, LinkTree alternative, Bio link alternative, Lime.io alternative, alternative, best link in bio tool, best tool"
        />
        <meta property="og:title" content="Linkify / Home" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://linkifyapp.com" />
        <meta property="og:image" content="/public/og.jpg" />
        <meta property="og:description" content="The one link that connects your audience" />
        <meta property="og:site_name" content="Linkify" />
        <meta property="og:locale" content="en_US" />
      </SEO>
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
