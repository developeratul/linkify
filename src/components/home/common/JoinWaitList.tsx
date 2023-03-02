import { clientEnv } from "@/env/schema.mjs";
import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

export default function JoinWaitListButton(props: ButtonProps) {
  const { colorScheme = "purple", ...restProps } = props;
  return (
    <Button
      {...restProps}
      colorScheme={colorScheme}
      as="a"
      href={clientEnv.NEXT_PUBLIC_WAITLIST_FORM_URL}
      target="_blank"
    >
      Join WaitList
    </Button>
  );
}
