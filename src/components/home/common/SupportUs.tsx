import { SocialIcon } from "@/Icons";
import type { ButtonProps } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

export default function SupportUsButton(props: ButtonProps) {
  const { colorScheme = "purple", ...restProps } = props;
  return (
    <Button
      {...restProps}
      colorScheme={colorScheme}
      as="a"
      href="https://www.buymeacoffee.com/Linkify"
      target="_blank"
      leftIcon={<SocialIcon name="IconCup" />}
    >
      Support us
    </Button>
  );
}
