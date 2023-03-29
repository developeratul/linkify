import { useToken } from "@chakra-ui/react";
import NpProgress from "nextjs-progressbar";

export default function ProgressBar() {
  const [themeColor] = useToken("colors", ["purple.500"]);
  return <NpProgress color={themeColor} />;
}
