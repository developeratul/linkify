import { AppLayout } from "@/Layouts/app";
import { env } from "@/env/server.mjs";
import { client } from "@/lib/lemonsqueezy";
import { requireAuth } from "@/server/auth";
import { api } from "@/utils/api";
import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Heading,
  List,
  ListIcon,
  ListItem,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { TablerIcon } from "components";
import { LemonsqueezyVariant } from "lemonsqueezy.ts/types";
import React from "react";
import { NextPageWithLayout } from "./_app";

const premiumFeatures = [
  "Unlimited links",
  "Full Access to Analytics",
  "Unlimited Testimonials",
  "Unlimited form submissions",
  "Own your page",
];

type SubscribePageProps = {
  variants: LemonsqueezyVariant[];
};

const SubscribePage: NextPageWithLayout<SubscribePageProps> = (props) => {
  const { variants } = props;
  const [isBillingMonthly, setBillingMonthly] = React.useState(true);
  const { mutateAsync, isLoading, isSuccess } = api.payment.createCheckout.useMutation();
  const toast = useToast();

  const yearlyPlan = React.useMemo(() => {
    return variants.find((variant) => variant.attributes.interval === "year");
  }, [variants]);

  const monthlyPlan = React.useMemo(() => {
    return variants.find((variant) => variant.attributes.interval === "month");
  }, [variants]);

  const selectedPlan = React.useMemo(() => {
    return isBillingMonthly ? monthlyPlan : yearlyPlan;
  }, [isBillingMonthly]);

  if (!selectedPlan) return <></>;

  const handleClick = async () => {
    try {
      const { data } = await mutateAsync({ variantId: `${selectedPlan.id}` });
      window.location.href = data.attributes.url;
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  return (
    <React.Fragment>
      <VStack w="full" spacing={10}>
        <VStack textAlign="center">
          <Heading color="purple.500" size="lg">
            Upgrade to pro
          </Heading>
          <Text>Become limitless with the pro plan ⚡</Text>
        </VStack>
        <ButtonGroup>
          <Button
            variant="outline"
            onClick={() => setBillingMonthly(true)}
            colorScheme={isBillingMonthly ? "purple" : undefined}
          >
            Monthly
          </Button>
          <Button
            onClick={() => setBillingMonthly(false)}
            colorScheme={!isBillingMonthly ? "purple" : undefined}
            variant="outline"
          >
            Yearly
          </Button>
        </ButtonGroup>
        <Box
          w="full"
          maxW="md"
          p={1}
          rounded="lg"
          bg="linear-gradient(90deg,#44FF9A -.55%,#44B0FF 22.86%,#8B44FF 48.36%,#FF6644 73.33%,#EBFF70 99.34%)"
        >
          <Box bg="white" rounded="md" px={5} py={10}>
            <VStack spacing={10}>
              <HStack align="end" color="gray.600">
                <Text>$</Text>
                <Heading color="black">{selectedPlan.attributes.price / 100}</Heading>
                <Text>/{selectedPlan.attributes.interval}</Text>
              </HStack>
              <List spacing={5}>
                {premiumFeatures.map((label, index) => (
                  <ListItem key={index}>
                    <ListIcon color="green.500">
                      <TablerIcon name="IconCheck" />
                    </ListIcon>
                    {label}
                  </ListItem>
                ))}
              </List>
              <Button
                isLoading={isLoading}
                disabled={isLoading || isSuccess}
                onClick={handleClick}
                colorScheme="purple"
                w="full"
                leftIcon={<TablerIcon size={20} name="IconBolt" />}
              >
                Become Limitless
              </Button>
            </VStack>
          </Box>
        </Box>
      </VStack>
    </React.Fragment>
  );
};

SubscribePage.getLayout = (page) => <AppLayout hidePreviewPanel>{page}</AppLayout>;
export default SubscribePage;
export const getServerSideProps = requireAuth(async () => {
  const variants = (await client.listAllVariants({ productId: env.LEMONS_SQUEEZY_PRODUCT_ID }))
    .data;
  return { props: { variants } };
});
