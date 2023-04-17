import { formatter } from "@/utils/number-formatter";
import {
  Box,
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import * as Icons from "@tabler/icons-react";
import { TablerIcon } from "components";
import React from "react";
import { Conditional } from "../../common/Conditional";

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
    <Box>
      <Popover isLazy boundary="scrollParent">
        <PopoverTrigger>{trigger}</PopoverTrigger>
        <PopoverContent w={{ base: "sm" }}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>{title || "Pick an Icon"}</PopoverHeader>
          <PopoverBody maxH="md" overflowX="hidden">
            <VStack spacing="5">
              <Input
                variant="filled"
                type="search"
                autoFocus
                onChange={handleInputChange}
                value={searchTerm}
                placeholder={`Search ${formatter.format(
                  iconNamesList.length
                )} icons by Tabler-icons`}
              />
              <Conditional
                condition={currentIcons.length > 0}
                fallback={
                  <Text py={5} color="GrayText" fontWeight="medium">
                    &quot;{searchTerm}&quot; Not found
                  </Text>
                }
                component={
                  <SimpleGrid columns={7} spacing={3}>
                    {currentIcons.map((iconName) => {
                      const isSelected = selectedIcon === iconName;
                      return (
                        <IconButton
                          colorScheme={isSelected ? "purple" : "gray"}
                          onClick={() => handleSelect(iconName)}
                          key={iconName}
                          aria-label={iconName}
                          icon={<TablerIcon name={iconName} />}
                        />
                      );
                    })}
                  </SimpleGrid>
                }
              />
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
}
