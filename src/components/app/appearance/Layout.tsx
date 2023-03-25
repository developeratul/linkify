import { SectionLoader } from "@/components/common/Loader";
import { Icon } from "@/Icons";
import { usePreviewContext } from "@/providers/preview";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ErrorMessage } from "../common/Message";
import SectionWrapper from "./common/SectionWrapper";

export const layoutSchema = z.object({
  layout: z.enum(["CARD", "WIDE"]),
  containerWidth: z.number().min(350, "Min width is 350px").max(1212, "Max width is 1212px"),
  linksColumnCount: z
    .number()
    .min(1, "Must have one column")
    .max(3, "Maximum 3 columns are supported"),
});

type LayoutSchema = z.infer<typeof layoutSchema>;

export default function Layout() {
  const { register, setValue, handleSubmit, formState } = useForm<LayoutSchema>({
    resolver: zodResolver(layoutSchema),
    defaultValues: {
      layout: "WIDE",
      containerWidth: 768,
      linksColumnCount: 1,
    },
  });

  const { isLoading, isError, error } = api.appearance.getLayout.useQuery(undefined, {
    onSuccess(data) {
      if (data) {
        (Object.keys(data) as ["layout", "containerWidth", "linksColumnCount"]).map((key) => {
          if (data[key]) {
            setValue(key, data[key]);
          }
        });
      }
    },
  });

  const { mutateAsync, isLoading: isProcessing } = api.appearance.updateLayout.useMutation();

  const utils = api.useContext();
  const previewContext = usePreviewContext();
  const toast = useToast();

  const onSubmit = async (value: LayoutSchema) => {
    try {
      await mutateAsync(value);
      await utils.appearance.getLayout.invalidate();
      previewContext?.reload();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        toast({ status: "error", description: err.message });
      }
    }
  };

  if (isLoading) return <SectionLoader />;
  if (isError) return <ErrorMessage description={error.message} />;

  return (
    <SectionWrapper title="Layout">
      <Chakra.VStack as="form" onSubmit={handleSubmit(onSubmit)} spacing={5}>
        <Chakra.FormControl>
          <Chakra.FormLabel>Page layout</Chakra.FormLabel>
          <Chakra.Select {...register("layout")}>
            <option value="WIDE">Wide</option>
            <option value="CARD">Card</option>
          </Chakra.Select>
        </Chakra.FormControl>
        <Chakra.FormControl isInvalid={!!formState.errors.containerWidth}>
          <Chakra.FormLabel>Container width</Chakra.FormLabel>
          <Chakra.Input type="number" {...register("containerWidth", { valueAsNumber: true })} />
          {!!formState.errors.containerWidth ? (
            <Chakra.FormErrorMessage>
              {formState.errors.containerWidth.message}
            </Chakra.FormErrorMessage>
          ) : (
            <Chakra.FormHelperText>We count in pixels</Chakra.FormHelperText>
          )}
        </Chakra.FormControl>
        <Chakra.FormControl isInvalid={!!formState.errors.linksColumnCount}>
          <Chakra.FormLabel>Link columns</Chakra.FormLabel>
          <Chakra.Input type="number" {...register("linksColumnCount", { valueAsNumber: true })} />
          {!!formState.errors.linksColumnCount ? (
            <Chakra.FormErrorMessage>
              {formState.errors.linksColumnCount.message}
            </Chakra.FormErrorMessage>
          ) : (
            <Chakra.FormHelperText>
              How many columns do you want to divide your links into?
            </Chakra.FormHelperText>
          )}
        </Chakra.FormControl>
        <Chakra.Button
          isLoading={isProcessing}
          type="submit"
          leftIcon={<Icon name="Save" />}
          colorScheme="purple"
          w="full"
        >
          Save changes
        </Chakra.Button>
      </Chakra.VStack>
    </SectionWrapper>
  );
}
