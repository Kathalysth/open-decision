import React, { useEffect } from "react";
import {
  styled,
  Text,
  Heading,
  Icon,
  Button,
  Stack,
} from "@open-legal-tech/design-system";
import { notification, useNotificationStore } from "./NotificationState";
import * as Progress from "@radix-ui/react-progress";
import { motion, useAnimation } from "framer-motion";
import { useGesture } from "react-use-gesture";
import { Info, XCircle, CheckCircle, HelpCircle, X } from "react-feather";

const icons = {
  error: XCircle,
  info: HelpCircle,
  success: CheckCircle,
  warning: Info,
} as const;

type NotificationProps = {
  notification: notification;
  id: string;
};

const Container = styled(motion.div, {
  $$accentColor: "$colors$colorScheme11",
  boxShadow: "$6",
  borderRadius: "$md",
  backgroundColor: "$white",

  defaultVariants: {
    variant: "neutral",
  },
});

const ProgressBar = styled(Progress.Root, {
  height: 3,
  margin: "0px 4px 4px 4px",
});

const ProgressIndicator = styled(Progress.Indicator, {
  height: "100%",
  backgroundColor: "$$accentColor",
  borderRadius: "$md",
});

export const Notification = ({ notification, id }: NotificationProps) => {
  const animation = useAnimation();

  const duration =
    notification.duration === "persistent" ? 5 : notification.duration;

  useEffect(() => {
    if (notification.duration === "persistent") {
      return animation.stop();
    }

    animation.start("empty");
  }, [notification.duration]);

  const IconSVG = icons[notification.variant];
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification
  );

  const gestures = useGesture({
    onPointerEnter: () => animation.stop(),
    onPointerLeave: () => animation.start("empty"),
    onClick: () => animation.set("full"),
    onFocus: () => animation.stop(),
    onBlur: () => animation.start("empty"),
  });

  const progress = {
    full: { width: "100%" },
    empty: { width: "0%" },
  };

  const container = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <Container
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
      css={{ colorScheme: notification.variant }}
      role="alert"
      layout
      {...gestures()}
    >
      <Stack
        css={{
          padding: "$5",
          flexDirection: "row",
          gap: "$5",
          alignItems: "center",
        }}
      >
        <Icon
          css={{
            marginBottom: "-2px",
            backgroundColor: "$colorScheme3",
            borderRadius: "$full",
            padding: "$3",
            color: "$$accentColor",
          }}
        >
          <IconSVG />
        </Icon>
        <Stack css={{ gap: "$1", flex: 1 }}>
          <Heading size="extra-small">{notification.title}</Heading>
          <Text>{notification.content}</Text>
        </Stack>
        <Button
          square
          variant="ghost"
          css={{
            "&:hover": { backgroundColor: "$colorScheme3", color: "$black" },
            "&:active": { backgroundColor: "$colorScheme5", color: "$black" },
          }}
          onClick={() => removeNotification(id)}
        >
          <Icon label="Benachrichtigung schließen">
            <X />
          </Icon>
        </Button>
      </Stack>
      <ProgressBar>
        <ProgressIndicator
          as={motion.div}
          variants={progress}
          transition={{ duration }}
          initial="full"
          animate={animation}
          onAnimationComplete={() => removeNotification(id)}
        />
      </ProgressBar>
    </Container>
  );
};
