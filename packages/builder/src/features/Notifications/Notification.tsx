import React, { useEffect } from "react";
import { styled, IconButton } from "@open-legal-tech/design-system";
import { notification, useNotificationStore } from "./NotificationState";
import * as Progress from "@radix-ui/react-progress";
import { motion, useAnimation } from "framer-motion";
import { useGesture } from "react-use-gesture";
import { AlertTriangle, Bell, CheckCircle, Slash, X } from "react-feather";

const icons = {
  danger: Slash,
  neutral: Bell,
  success: CheckCircle,
  warning: AlertTriangle,
} as const;

type NotificationProps = {
  notification: notification;
  id: string;
};

const Container = styled(motion.div, {
  boxShadow: "$lg",
  borderRadius: "$md",
  border: "2px solid",

  variants: {
    variant: {
      neutral: {
        backgroundColor: "$gray2",
        color: "$gray9",
      },
      danger: {
        backgroundColor: "$red50",
        color: "$red800",
      },
      warning: {
        backgroundColor: "$amber50",
        color: "$amber800",
      },
      success: {
        backgroundColor: "$green50",
        color: "$green800",
      },
    },
  },

  defaultVariants: {
    variant: "neutral",
  },
});

const Header = styled("header", {
  fontSize: "$lg",
  fontWeight: "$semibold",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  "& div": {
    display: "flex",
    alignItems: "center",
  },
});

const Content = styled("div", {});

const ProgressBar = styled(Progress.Root, {
  height: 3,
});

const ProgressIndicator = styled(Progress.Indicator, {
  height: "100%",
  backgroundColor: "currentColor",
});

export const Notification: React.FC<NotificationProps> = ({
  notification,
  id,
  ...props
}) => {
  const animation = useAnimation();

  useEffect(() => {
    animation.start("empty");
  }, []);

  const Icon = icons[notification.variant];
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
      variant={notification.variant}
      {...gestures()}
      role="alert"
      {...props}
    >
      <ProgressBar>
        <ProgressIndicator
          as={motion.div}
          variants={progress}
          transition={{ duration: notification.duration }}
          initial="full"
          animate={animation}
          onAnimationComplete={() => removeNotification(id)}
        />
      </ProgressBar>
      <div className="px-4 py-2">
        <Header>
          <div>
            <Icon
              style={{ width: "1.3em", marginRight: "8px", display: "inline" }}
            />
            {notification.title}
          </div>
          <IconButton
            onClick={() => removeNotification(id)}
            label="Benachrichtigung schließen"
            Icon={<X style={{ width: "1.3em" }} />}
          />
        </Header>
        <Content css={{ marginTop: "$2" }}>{notification.content}</Content>
      </div>
    </Container>
  );
};