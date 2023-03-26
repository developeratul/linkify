import LogoSrc from "@/assets/logo.png";
import * as Chakra from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import JoinWaitListButton from "./common/JoinWaitList";

export default function TopBar() {
  const navRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const handleScroll = () => {
      const nav = navRef.current;
      nav?.classList.toggle("scrolled_nav", window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Chakra.Box
      as="nav"
      p={5}
      position="fixed"
      className="duration-100"
      w="full"
      top={0}
      left={0}
      ref={navRef}
      zIndex="sticky"
    >
      <Chakra.Container maxW="container.xl">
        <Chakra.HStack justify="space-between">
          <Link href="/">
            <Image src={LogoSrc} width={150} alt="Linkify logo" />
          </Link>
          <Chakra.HStack>
            <JoinWaitListButton />
          </Chakra.HStack>
        </Chakra.HStack>
      </Chakra.Container>
    </Chakra.Box>
  );
}
