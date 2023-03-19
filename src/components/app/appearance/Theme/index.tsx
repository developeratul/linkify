import { Conditional } from "@/components/common/Conditional";
import { SectionLoader } from "@/components/common/Loader";
import { api } from "@/utils/api";
import * as Chakra from "@chakra-ui/react";
import { ErrorMessage } from "../../common/Message";
import SectionWrapper from "../common/SectionWrapper";
import CustomThemeEditor from "./CustomThemeEditor";

export default function Theme() {
  const { isLoading, data: theme, isError, error } = api.appearance.getTheme.useQuery();

  if (isLoading) return <SectionLoader />;
  if (isError) return <ErrorMessage description={error.message} />;

  return (
    <SectionWrapper title="Theme">
      <Conditional
        condition={!!theme?.isCustomTheme}
        component={<CustomThemeEditor />}
        fallback={
          <Chakra.SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={5}></Chakra.SimpleGrid>
        }
      />
    </SectionWrapper>
  );
}
