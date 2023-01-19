import { Conditional } from "@/components/common/Conditional";
import { Icons } from "@/Icons";
import { api } from "@/utils/api";
import uploadFile from "@/utils/uploadFile";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { TRPCClientError } from "@trpc/client";
import { AxiosError } from "axios";
import type { ChangeEvent } from "react";
import React from "react";
import * as z from "zod";
import type { Link } from ".";
import { RemoveThumbnail } from "./RemoveThumbnail";

export const addThumbnailSchema = z.object({
  url: z.string().url("Invalid URL"),
  publicId: z.string().optional(),
});

export function AddThumbnail(props: { link: Link }) {
  const {
    link: { id: linkId, thumbnail },
  } = props;
  const { mutateAsync } = api.link.addThumbnail.useMutation();
  const [isLoading, setLoading] = React.useState(false);
  const [isEditingThumbnail, setEditingThumbnail] = React.useState(
    !!!thumbnail
  );
  const [file, setFile] = React.useState<Blob | string | null>();
  const { isOpen, onClose, onOpen } = Chakra.useDisclosure();
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const toast = useToast();
  const utils = api.useContext();

  const closePopover = () => {
    onClose();
    setTimeout(() => {
      setFile(null);
      formRef?.current?.reset();
    }, 100);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUrlInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      if (file instanceof Blob) {
        const { secure_url, public_id } = await uploadFile(file);
        await mutateAsync({ linkId, publicId: public_id, url: secure_url });
      } else if (typeof file === "string") {
        await mutateAsync({ linkId, url: file });
      }

      await utils.group.getWithLinks.invalidate();
      closePopover();
      setFile(null);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          status: "error",
          description: err.response?.data.message || err.message,
        });
      } else if (err instanceof TRPCClientError) {
        toast({
          status: "error",
          description: err.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setEditingThumbnail(!!!thumbnail);
  }, [thumbnail]);

  return (
    <Chakra.Popover onOpen={onOpen} isOpen={isOpen} onClose={closePopover}>
      <Chakra.PopoverTrigger>
        <Chakra.IconButton
          colorScheme="purple"
          icon={Icons.Icons}
          aria-label="Add Link thumbnail"
        />
      </Chakra.PopoverTrigger>
      <Chakra.PopoverContent>
        <Chakra.PopoverArrow />
        <Chakra.PopoverCloseButton />
        <Chakra.PopoverHeader>Thumbnail</Chakra.PopoverHeader>
        <Chakra.PopoverBody>
          {isEditingThumbnail ? (
            <Chakra.VStack
              as="form"
              onSubmit={handleSubmit}
              // ref={formRef as never}
              id="add-thumbnail-form"
            >
              <Chakra.FormControl>
                <Chakra.FormLabel>Enter public URL</Chakra.FormLabel>
                <Chakra.Input size="sm" onChange={handleUrlInputChange} />
              </Chakra.FormControl>
              <Chakra.Text py={1} fontWeight="medium">
                or
              </Chakra.Text>
              <Chakra.FormControl>
                <Chakra.FormLabel>Upload File</Chakra.FormLabel>
                <Chakra.Input
                  onChange={handleFileInputChange}
                  size="sm"
                  type="file"
                  accept="image/jpeg, image/png, image/gif, image/svg+xml"
                />
              </Chakra.FormControl>
            </Chakra.VStack>
          ) : (
            <Chakra.Box>
              <Conditional
                condition={!!thumbnail}
                component={
                  <Chakra.Image
                    src={thumbnail as string}
                    alt={thumbnail as string}
                  />
                }
                fallback={
                  <Chakra.Text
                    textAlign="center"
                    py={5}
                    color="GrayText"
                    fontWeight="medium"
                  >
                    No thumbnail
                  </Chakra.Text>
                }
              />
            </Chakra.Box>
          )}
        </Chakra.PopoverBody>
        <Chakra.PopoverFooter>
          <Conditional
            condition={isEditingThumbnail}
            component={
              <>
                <Chakra.Button
                  size="sm"
                  mr={3}
                  onClick={() =>
                    thumbnail ? setEditingThumbnail(false) : closePopover()
                  }
                >
                  Cancel
                </Chakra.Button>
                <Chakra.Button
                  size="sm"
                  colorScheme="purple"
                  type="submit"
                  form="add-thumbnail-form"
                  isLoading={isLoading}
                >
                  Save
                </Chakra.Button>
              </>
            }
            fallback={
              <Chakra.HStack>
                <Chakra.Button
                  onClick={() => setEditingThumbnail(true)}
                  size="sm"
                  colorScheme="purple"
                >
                  Edit
                </Chakra.Button>
                <RemoveThumbnail linkId={linkId} />
              </Chakra.HStack>
            }
          />
        </Chakra.PopoverFooter>
      </Chakra.PopoverContent>
    </Chakra.Popover>
  );
}
