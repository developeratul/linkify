import { Icons } from "@/Icons";
import * as Chakra from "@chakra-ui/react";

export type Link = {
  id: string;
  icon: string;
  text: string;
  url: string;
};

export type LinkProps = {
  link: Link;
};

export function Link(props: LinkProps) {
  const { link } = props;
  return (
    <Chakra.Card w="full" bg="white" size="lg">
      <Chakra.CardBody>
        <Chakra.Editable selectAllOnFocus={false} defaultValue={link.text}>
          <Chakra.EditablePreview
            as={Chakra.Heading}
            size="md"
            fontWeight="medium"
            cursor="pointer"
          />
          <Chakra.EditableInput />
        </Chakra.Editable>
        <Chakra.Editable selectAllOnFocus={false} defaultValue={link.url}>
          <Chakra.EditablePreview as={Chakra.Text} size="sm" cursor="pointer" />
          <Chakra.EditableInput />
        </Chakra.Editable>
      </Chakra.CardBody>
      <Chakra.CardFooter pt={0}>
        <Chakra.HStack w="full" justifyContent="space-between">
          <Chakra.HStack>
            <Chakra.IconButton icon={Icons.Icons} aria-label="Link icon" />
          </Chakra.HStack>
          <Chakra.IconButton
            colorScheme="red"
            icon={Icons.Delete}
            aria-label="Delete link"
          />
        </Chakra.HStack>
      </Chakra.CardFooter>
    </Chakra.Card>
  );
}

export type LinksProps = {
  links: Link[];
};

export default function Links(props: LinksProps) {
  const { links } = props;
  return (
    <>
      {links.map((link) => (
        <Link link={link} key={link.id} />
      ))}
    </>
  );
}
