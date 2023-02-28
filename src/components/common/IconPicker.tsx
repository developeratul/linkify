import { SocialIcon } from "@/Icons";
import { formatter } from "@/utils/number-formatter";
import * as Chakra from "@chakra-ui/react";
import * as Icons from "@tabler/icons-react";
import React from "react";
import { Conditional } from "./Conditional";

type IconPickerProps = {
  title?: string;
  trigger: React.ReactNode;
  setStateAction: React.Dispatch<React.SetStateAction<string>>;
  selectedIcon: string;
};

const iconNamesList = Object.keys(Icons).filter((key) => key !== "createReactComponent");
const initialIcons = iconNamesList.slice(0, 140);

export default function IconPicker(props: IconPickerProps) {
  const { title, trigger, setStateAction, selectedIcon } = props;
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentIcons, setCurrentIcons] = React.useState(initialIcons);
  const [, startTransition] = React.useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    startTransition(() => {
      if (e.target.value === "") {
        setCurrentIcons(initialIcons);
      } else {
        setCurrentIcons(iconNamesList.filter((name) => name.match(new RegExp(searchTerm, "gi"))));
      }
    });
  };

  const handleSelect = (iconName: string) => {
    setStateAction(iconName);
  };

  return (
    <Chakra.Box>
      <Chakra.Popover isLazy boundary="scrollParent">
        <Chakra.PopoverTrigger>{trigger}</Chakra.PopoverTrigger>
        <Chakra.PopoverContent w={{ base: "sm" }}>
          <Chakra.PopoverArrow />
          <Chakra.PopoverCloseButton />
          <Chakra.PopoverHeader>{title || "Pick an Icon"}</Chakra.PopoverHeader>
          <Chakra.PopoverBody maxH="md" overflowX="hidden">
            <Chakra.VStack spacing="5">
              <Chakra.Input
                variant="filled"
                type="search"
                autoFocus
                onChange={handleInputChange}
                value={searchTerm}
                placeholder={`Search ${formatter.format(iconNamesList.length)} icons by Tabler-icons`}
              />
              <Conditional
                condition={currentIcons.length > 0}
                fallback={
                  <Chakra.Text py={5} color="GrayText" fontWeight="medium">
                    &quot;{searchTerm}&quot; Not found
                  </Chakra.Text>
                }
                component={
                  <Chakra.SimpleGrid columns={7} spacing={3}>
                    {currentIcons.map((iconName) => {
                      const isSelected = selectedIcon === iconName;
                      return (
                        <Chakra.IconButton
                          colorScheme={isSelected ? "purple" : "gray"}
                          onClick={() => handleSelect(iconName)}
                          key={iconName}
                          aria-label={iconName}
                          icon={<SocialIcon name={iconName} />}
                        />
                      );
                    })}
                  </Chakra.SimpleGrid>
                }
              />
            </Chakra.VStack>
          </Chakra.PopoverBody>
        </Chakra.PopoverContent>
      </Chakra.Popover>
    </Chakra.Box>
  );
}
