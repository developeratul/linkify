import Rating from "@/components/common/Rating";
import { useProfileContext } from "@/providers/profile";
import { Avatar, Box, Heading, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";

export default function Testimonials() {
  const profile = useProfileContext();

  if (profile === undefined) return <></>;

  return (
    <SimpleGrid columns={1} spacing={10}>
      {profile.testimonials.length > 0 &&
        profile.testimonials.map((testimonial) => (
          <Box key={testimonial.id}>
            <Stack
              spacing={5}
              direction={{ base: "column", md: "row" }}
              align={{ base: "center", md: "start" }}
            >
              <Avatar
                src={testimonial.avatar || ""}
                size={{ base: "xl", md: "lg" }}
                name={testimonial.name}
              />
              <VStack align={{ base: "center", md: "start" }}>
                <VStack align={{ base: "center", md: "start" }}>
                  <Heading
                    fontFamily={profile.theme.font.style.fontFamily}
                    fontSize={{ base: "md", md: "lg" }}
                    textAlign="center"
                  >
                    {testimonial.name}
                  </Heading>
                  <Text textAlign="start" fontSize={{ base: "sm", md: "md" }} whiteSpace="pre-wrap">
                    {testimonial.message}
                  </Text>
                </VStack>
                <Rating rating={testimonial.rating} starDimension="20px" starSpacing="2px" />
              </VStack>
            </Stack>
          </Box>
        ))}
    </SimpleGrid>
  );
}
