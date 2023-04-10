import { AppLayout } from "@/Layouts/app";
import { env } from "@/env/server.mjs";
import { client } from "@/lib/lemonsqueezy";
import { requireAuth } from "@/server/auth";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { TablerIcon } from "components";
import { LemonsqueezyVariant } from "lemonsqueezy.ts/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import React from "react";
import { NextPageWithLayout } from "./_app";

const premiumFeatures = [
  "Unlimited links",
  "Unlock all themes",
  "Advanced analytics",
  "Collect 50 testimonials per month",
  "Showcase 30 testimonials on your profile",
  "400 form submissions per month",
  "Developer API (200 requests per day)",
  "Newsletter (Coming soon...)",
];

type SubscribePageProps = {
  variants: LemonsqueezyVariant[];
};

const SubscribePage: NextPageWithLayout<SubscribePageProps> = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { variants } = props;
  const [isBillingMonthly, setBillingMonthly] = React.useState(true);
  const { mutateAsync, isLoading, isSuccess } = api.payment.createCheckout.useMutation();
  const toast = Chakra.useToast();

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
      <Chakra.VStack w="full" spacing={10}>
        <Chakra.VStack textAlign="center">
          <Chakra.Heading color="purple.500" size="lg">
            Upgrade to pro
          </Chakra.Heading>
          <Chakra.Text>Become limitless with the pro plan ⚡</Chakra.Text>
        </Chakra.VStack>
        <Chakra.ButtonGroup>
          <Chakra.Button
            onClick={() => setBillingMonthly(true)}
            colorScheme={isBillingMonthly ? "purple" : undefined}
          >
            Monthly
          </Chakra.Button>
          <Chakra.Button
            onClick={() => setBillingMonthly(false)}
            colorScheme={!isBillingMonthly ? "purple" : undefined}
          >
            Yearly
          </Chakra.Button>
        </Chakra.ButtonGroup>
        <Chakra.Box
          w="full"
          maxW="md"
          p={1}
          rounded="lg"
          bg="linear-gradient(90deg,#44FF9A -.55%,#44B0FF 22.86%,#8B44FF 48.36%,#FF6644 73.33%,#EBFF70 99.34%)"
        >
          <Chakra.Box bg="white" rounded="md" px={5} py={10}>
            <Chakra.VStack spacing={10}>
              <Chakra.HStack align="end" color="gray.600">
                <Chakra.Text>$</Chakra.Text>
                <Chakra.Heading color="black">{selectedPlan.attributes.price / 100}</Chakra.Heading>
                <Chakra.Text>/{selectedPlan.attributes.interval}</Chakra.Text>
              </Chakra.HStack>
              <Chakra.List spacing={5}>
                {premiumFeatures.map((label, index) => (
                  <Chakra.ListItem key={index}>
                    <Chakra.ListIcon color="green.500">
                      <TablerIcon name="IconCheck" />
                    </Chakra.ListIcon>
                    {label}
                  </Chakra.ListItem>
                ))}
              </Chakra.List>
              <Chakra.Button
                isLoading={isLoading}
                disabled={isLoading || isSuccess}
                onClick={handleClick}
                colorScheme="purple"
                w="full"
              >
                Upgrade
              </Chakra.Button>
            </Chakra.VStack>
          </Chakra.Box>
        </Chakra.Box>
      </Chakra.VStack>
    </React.Fragment>
  );
};

SubscribePage.getLayout = (page) => <AppLayout hidePreviewPanel>{page}</AppLayout>;
export default SubscribePage;
export const getServerSideProps: GetServerSideProps<SubscribePageProps> = requireAuth(async () => {
  const variants = (await client.listAllVariants({ productId: env.LEMONS_SQUEEZY_PRODUCT_ID }))
    .data;
  return { props: { variants } };
});
