import * as Chakra from "@chakra-ui/react";
import SectionWrapper from "./common/SectionWrapper";

type Question = {
  question: string;
  answer: string;
};

const questions: Question[] = [
  {
    question: "What is Linkify",
    answer:
      "Linkify is a link-in-bio and an all-in-one tool that allows you to connect with your audience with just one link. It is primarily a social media reference tool but serves a greater purpose.",
  },
  {
    question: "Why do I need a link in bio tool?",
    answer:
      "Right now, every time you’ve got something new to share, you have to go to every single one of your channels to change the link in each of your bios. It’s time-consuming and complicated – making it so much harder to keep everything up to date.\n\nA link in bio tool means you never have to compromise, or remove one link from your bio so you can add another. You can keep everything you want to share online in one link. When you've got a change, you only ever have to make it once.\n©LinkTree",
  },
  {
    question: "What makes Linkify better than the other link in bio options?",
    answer:
      "Linkify is not just a link-in-bio tool but also an all-in-one tool that has a bigger purpose than just showcasing your links. You can collect testimonials, form submissions, and interact with your audience by sending them automated newsletters. Also, the customizability of Linkify will be better than any other tool available on the market.",
  },
  {
    question: "Is it going to be free?",
    answer: "It will be mostly free but some of the parts will require a subscription.",
  },
  {
    question: "How can I show my appreciation?",
    answer: "Consider joining the wait list and fund the project with a small donation :)",
  },
];

export default function FAQ() {
  return (
    <SectionWrapper id="faq">
      <Chakra.VStack w="full" spacing={10}>
        <Chakra.Heading textAlign="center" size="lg">
          Frequently Asked Questions
        </Chakra.Heading>
        <Chakra.Accordion allowToggle w="full">
          {questions.map((question, index) => (
            <Chakra.AccordionItem key={index}>
              <Chakra.AccordionButton _expanded={{ fontWeight: "semibold" }}>
                <Chakra.Box as="span" flex="1" textAlign="left">
                  {question.question}
                </Chakra.Box>
                <Chakra.AccordionIcon />
              </Chakra.AccordionButton>
              <Chakra.AccordionPanel whiteSpace="pre-wrap" pb={4}>
                {question.answer}
              </Chakra.AccordionPanel>
            </Chakra.AccordionItem>
          ))}
        </Chakra.Accordion>
        <Chakra.Button
          as="a"
          target="_blank"
          href="https://forms.gle/McpuxaQJ9hLQ6H1X6"
          colorScheme="purple"
        >
          Question not mentioned?
        </Chakra.Button>
      </Chakra.VStack>
    </SectionWrapper>
  );
}
