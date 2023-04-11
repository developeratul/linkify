import { AppLayout } from "@/Layouts/app";
import * as Chakra from "@chakra-ui/react";
import type { NextPageWithLayout } from "./_app";

const AnalyticsPage: NextPageWithLayout = () => {
  return (
    <Chakra.Container maxW="container.xl">
      <Chakra.VStack>
        <Chakra.SimpleGrid w="full" spacing={5} columns={4}>
          <Chakra.Box borderWidth={1} rounded="md" bg="white" p={5}>
            <Chakra.Stat>
              <Chakra.StatLabel>Sent</Chakra.StatLabel>
              <Chakra.StatNumber>345,670</Chakra.StatNumber>
              <Chakra.StatHelpText>
                <Chakra.StatArrow type="increase" />
                23.36%
              </Chakra.StatHelpText>
            </Chakra.Stat>
          </Chakra.Box>
          <Chakra.Box borderWidth={1} rounded="md" bg="white" p={5}>
            <Chakra.Stat>
              <Chakra.StatLabel>Sent</Chakra.StatLabel>
              <Chakra.StatNumber>345,670</Chakra.StatNumber>
              <Chakra.StatHelpText>
                <Chakra.StatArrow type="increase" />
                23.36%
              </Chakra.StatHelpText>
            </Chakra.Stat>
          </Chakra.Box>
          <Chakra.Box borderWidth={1} rounded="md" bg="white" p={5}>
            <Chakra.Stat>
              <Chakra.StatLabel>Sent</Chakra.StatLabel>
              <Chakra.StatNumber>345,670</Chakra.StatNumber>
              <Chakra.StatHelpText>
                <Chakra.StatArrow type="increase" />
                23.36%
              </Chakra.StatHelpText>
            </Chakra.Stat>
          </Chakra.Box>
          <Chakra.Box borderWidth={1} rounded="md" bg="white" p={5}>
            <Chakra.Stat>
              <Chakra.StatLabel>Sent</Chakra.StatLabel>
              <Chakra.StatNumber>345,670</Chakra.StatNumber>
              <Chakra.StatHelpText>
                <Chakra.StatArrow type="increase" />
                23.36%
              </Chakra.StatHelpText>
            </Chakra.Stat>
          </Chakra.Box>
        </Chakra.SimpleGrid>
      </Chakra.VStack>
    </Chakra.Container>
  );
};

AnalyticsPage.getLayout = (page) => <AppLayout hidePreviewPanel>{page}</AppLayout>;

export default AnalyticsPage;
