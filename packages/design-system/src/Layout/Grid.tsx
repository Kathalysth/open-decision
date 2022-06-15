import { OnlyString } from "@stitches/react/types/css";
import * as React from "react";
import { styled } from "../stitches";
import { gap } from "../shared/variants";

const StyledGrid = styled("div", gap, {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit, minmax(min($$minimumColumnWidth, 100%), 1fr))",

  variants: {
    center: {
      true: {
        justifyContent: "center",
        alignItems: "center",
      },
    },
  },
});

export type GridProps = React.ComponentProps<typeof StyledGrid> & {
  minimumColumnWidth?: number | OnlyString;
};

export const Grid = ({
  children,
  css,
  minimumColumnWidth = "250px",
  ...props
}: GridProps) => (
  <StyledGrid
    css={{ $$minimumColumnWidth: minimumColumnWidth, ...css }}
    {...props}
  >
    {children}
  </StyledGrid>
);