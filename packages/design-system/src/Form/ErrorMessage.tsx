import { Box } from "../Box";
import { styled } from "../stitches";
import { textStyles } from "../Text";

export const ErrorMessage = styled(Box, textStyles, {
  color: "$danger11",
  backgroundColor: "$danger1",
  borderRadius: "$md",

  "&:not(:empty)": {
    padding: "$1 $2",
    border: "1px solid $colors$danger5",
  },
});