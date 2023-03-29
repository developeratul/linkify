import { useToken } from "@chakra-ui/react";
import StarRatings from "react-star-ratings";

interface StarRatingProps {
  rating?: number;
  numberOfStars?: number;
  changeRating?: (rating: number) => void;
  starRatedColor?: string;
  starEmptyColor?: string;
  starHoverColor?: string;
  starDimension?: string;
  starSpacing?: string;
  gradientPathName?: string;
  ignoreInlineStyles?: boolean;
  svgIconPath?: string;
  svgIconViewBox?: string;
  name?: string;
}

export default function Rating({ starDimension, starSpacing, ...props }: StarRatingProps) {
  const [yellow] = useToken("colors", ["orange.400"]);
  return (
    <StarRatings
      {...props}
      starRatedColor={yellow}
      starDimension={starDimension || "30px"}
      starSpacing={starSpacing || "5px"}
      numberOfStars={5}
    />
  );
}
