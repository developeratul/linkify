import { Icon } from "@/Icons";
import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

export default function JoinWaitListButton(props: ButtonProps) {
  const { colorScheme = "purple", ...restProps } = props;
  return (
    <Button
      {...restProps}
      colorScheme={colorScheme}
      as="a"
      href="https://form.waitlistpanda.com/go/upmaaq1VwH2GrW75pJLY"
      target="_blank"
      leftIcon={<Icon name="Join" />}
    >
      Join Waitlist
    </Button>
  );
}
