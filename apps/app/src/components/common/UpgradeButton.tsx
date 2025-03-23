import { api } from "@/utils/api";
import { Button, ButtonProps } from "@chakra-ui/react";
import { Icon } from "components";
import Link from "next/link";

export default function UpgradeButton(props: ButtonProps) {
  const { colorScheme, size, ...restProps } = props;
  const { data } = api.payment.getSubscription.useQuery();
  if (data?.isPro) return <></>;
  return (
    <Button
      {...restProps}
      as={Link}
      href="/subscribe"
      colorScheme={colorScheme || "purple"}
      leftIcon={<Icon name="Subscribe" />}
      rounded="full"
      size={size || "sm"}
    >
      Upgrade
    </Button>
  );
}
