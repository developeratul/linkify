import { IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useLocalStorage } from "@mantine/hooks";
import { IconBrandVercel, IconMessage2, IconMessageCircle2 } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Feedback() {
  const [showPing, setShowPing] = useLocalStorage({
    key: "show-feedback-ping",
    defaultValue: false,
  });

  const [feedbackOpened, setFeedbackOpened] = useLocalStorage({
    key: "feedback-opened",
    defaultValue: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPing(true);
    }, 60000); // 60 seconds delay before animation starts

    return () => clearTimeout(timer);
  }, [setShowPing]);

  const handleOpen = () => {
    setFeedbackOpened(true);
  };

  return (
    <div className="fixed bottom-5 left-5 isolate">
      {!feedbackOpened && showPing && (
        <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500 opacity-75" />
      )}
      <Menu onOpen={handleOpen}>
        <MenuButton
          rounded="full"
          size="lg"
          zIndex="dropdown"
          colorScheme="twitter"
          dropShadow="lg"
          aria-label="Feedback"
          as={IconButton}
          icon={<IconMessage2 size={24} stroke={1.5} />}
        />
        <MenuList>
          <MenuItem
            as={Link}
            href="https://x.com/messages/compose?recipient_id=1358295578870878209"
            target="_blank"
            referrerPolicy="no-referrer"
            icon={<IconMessageCircle2 size={18} stroke={1.5} />}
          >
            Give Feedback
          </MenuItem>
          <MenuItem
            as={Link}
            href="https://contra.com/minhazratul"
            target="_blank"
            referrerPolicy="origin"
            icon={<IconBrandVercel className="text-orange-500" size={18} stroke={1.5} />}
          >
            Hire SaaS Developer
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}
