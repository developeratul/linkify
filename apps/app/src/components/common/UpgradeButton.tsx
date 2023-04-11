import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { TablerIcon } from "components";
import Link from "next/link";

export default function UpgradeButton(props: Chakra.ButtonProps) {
  const { colorScheme, size, ...restProps } = props;
  const { data } = api.payment.getSubscription.useQuery();
  if (data?.isPro) return <></>;
  return (
    <Chakra.Button
      {...restProps}
      as={Link}
      href="/subscribe"
      colorScheme={colorScheme || "purple"}
      leftIcon={<TablerIcon size={20} name="IconBolt" />}
      rounded="full"
      size={size || "sm"}
    >
      Upgrade
    </Chakra.Button>
  );
}
