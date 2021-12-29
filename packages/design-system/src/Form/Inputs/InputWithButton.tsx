import * as React from "react";
import { styled, StyleObject } from "../../stitches";
import { Box } from "../../Box";
import { Input as SystemInput } from "./Input";
import { Button as SystemButton } from "../../Button/Button";

const StyledBox = styled(Box, {
  display: "flex",
  flexWrap: "wrap",
});

export type InputWithButtonProps = {
  Input: React.ReactElement<React.ComponentProps<typeof SystemInput>>;
  Button: React.ReactElement<React.ComponentProps<typeof SystemButton>>;
  radius?: string;
  css?: StyleObject;
};

const InputWithButtonComp = (
  { Input, Button, radius = "$radii$md", css, ...props }: InputWithButtonProps,
  ref: React.Ref<HTMLInputElement>
) => {
  return (
    <StyledBox css={css}>
      {React.cloneElement(Input, {
        ref,
        ...props,
        css: {
          ...Input.props?.css,
          flex: "1 1 100%",
          borderRadius: "$none",
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,

          "@largePhone": {
            flex: "1 1 70%",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: radius,
            borderTopLeftRadius: radius,
          },
        },
      })}
      {React.cloneElement(Button, {
        css: {
          ...Button.props?.css,
          boxShadow: "$none",
          flex: "1 0 100%",
          borderRadius: "$none",
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          borderBottomRightRadius: radius,
          borderBottomLeftRadius: radius,
          maxWidth: "unset",

          "@largePhone": {
            flex: "1 0",
            maxWidth: "max-content",
            borderBottomLeftRadius: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: radius,
            borderBottomRightRadius: radius,
          },
        },
      })}
    </StyledBox>
  );
};

export const InputWithButton = React.forwardRef<
  HTMLInputElement,
  InputWithButtonProps
>(InputWithButtonComp);
