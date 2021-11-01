import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { styled } from "@open-legal-tech/design-system";

const Content = styled(TooltipPrimitive.Content, {
  backgroundColor: "$gray3",
  padding: "$1 $2",
});

export type TooltipProps = {
  content: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
} & React.ComponentProps<typeof Content>;

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}) => (
  <TooltipPrimitive.Root
    open={open}
    defaultOpen={defaultOpen}
    onOpenChange={onOpenChange}
  >
    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
    <Content side="top" align="center" sideOffset={10} {...props}>
      {content}
    </Content>
  </TooltipPrimitive.Root>
);
