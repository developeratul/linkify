import * as Chakra from "@chakra-ui/react";
import { IconExternalLink } from "@tabler/icons-react";
import NextLink from "next/link";
import SectionWrapper from "./common/SectionWrapper";

export default function Footer() {
  return (
    <SectionWrapper bg="purple.900" py={50} color="purple.50" id="footer" as="footer">
      <Chakra.HStack
        flexDirection={{ base: "column", md: "row" }}
        rowGap={{ base: 20, md: 0 }}
        align="start"
        justify="space-between"
      >
        <FooterSectionWrapper title="Linkify">
          <Chakra.Text>&copy; {new Date().getFullYear()}</Chakra.Text>
        </FooterSectionWrapper>
        <FooterSection
          title="Links"
          links={[
            {
              text: "Join the waitlist",
              url: "https://form.waitlistpanda.com/go/upmaaq1VwH2GrW75pJLY",
              isExternal: true,
            },
            {
              text: "Support and fund this project",
              url: "https://www.buymeacoffee.com/Linkify",
              isExternal: true,
            },
          ]}
        />
        <FooterSection
          title="Socials"
          links={[
            { text: "Twitter", url: "http://twitter.com/developeratul", isExternal: true },
            {
              text: "Linkedin",
              url: "https://www.linkedin.com/in/minhazur-rahman-ratul-407352211",
              isExternal: true,
            },
            {
              text: "GitHub",
              url: "http://github.com/developeratul",
              isExternal: true,
            },
            {
              text: "Buy me a coffee",
              url: "https://www.buymeacoffee.com/Linkify",
              isExternal: true,
            },
          ]}
        />
      </Chakra.HStack>
    </SectionWrapper>
  );
}

function FooterSectionWrapper(props: { children: React.ReactNode; title: string }) {
  const { title, children } = props;
  return (
    <Chakra.VStack spacing={5} align="start">
      <Chakra.Heading fontSize="lg" fontFamily="monospace">
        {title}
      </Chakra.Heading>
      {children}
    </Chakra.VStack>
  );
}

type Link = {
  text: string;
  url: string;
  isExternal?: boolean;
};

type FooterSectionProps = {
  title: string;
  links: Link[];
};

function FooterSection(props: FooterSectionProps) {
  const { title, links } = props;
  return (
    <FooterSectionWrapper title={title}>
      {links.map((link, index) =>
        link.isExternal ? (
          <Chakra.Link
            isExternal={link.isExternal}
            key={index}
            href={link.url}
            display="flex"
            alignItems="center"
            gap={2}
          >
            {link.text} <IconExternalLink size={18} />
          </Chakra.Link>
        ) : (
          <Chakra.Link key={index} as={NextLink} href={link.url}>
            {link.text}
          </Chakra.Link>
        )
      )}
    </FooterSectionWrapper>
  );
}
