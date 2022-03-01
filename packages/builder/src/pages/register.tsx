import {
  Button,
  ErrorMessage,
  Field,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useForm,
} from "@open-decision/design-system";
import { MainContent } from "components";
import { useAuth } from "features/Auth/useAuth";
import * as React from "react";

export default function Login(): JSX.Element {
  const [Form, { register }] = useForm({
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const [state, send] = useAuth();

  return (
    <MainContent
      css={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        background: "url(/background_pattern_auth_pages.svg)",
        backgroundSize: "cover",
        alignItems: "center",
      }}
    >
      <Stack
        center
        css={{
          height: "100%",
          maxWidth: "550px",
        }}
      >
        <Stack
          css={{
            backgroundColor: "$gray1",
            padding: "$9",
            boxShadow: "$7",
            borderRadius: "$md",
          }}
        >
          <Heading size="large" css={{ marginBottom: "$3" }}>
            Registrieren
          </Heading>
          <Text css={{ color: "$gray11", marginBottom: "$8" }}>
            Registrieren sie sich jetzt und erstellen sie ihr erstes Open
            Decision-Projekt.
          </Text>
          <Form
            onSubmit={({ email, password }) =>
              send({ type: "REGISTER", email, password })
            }
            css={{ display: "flex", flexDirection: "column" }}
          >
            <Field label="Mailadresse">
              <Input
                {...register("email", {
                  required: {
                    value: true,
                    message: "Eine E-Mail Addresse muss angegeben werden.",
                  },
                })}
                placeholder="beispiel@web.de"
              />
            </Field>
            <Field label="Passwort" css={{ marginTop: "$4" }}>
              <Input
                type="password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Ein Passwort muss angegeben werden.",
                  },
                })}
                placeholder="*******"
              />
            </Field>
            <Field label="Passwort wiederholen" css={{ marginTop: "$4" }}>
              <Input
                type="password"
                {...register("password_confirmation", {
                  required: {
                    value: true,
                    message:
                      "Sie müssen ihr Passwort erneut eingeben um Rechtschreibfehlern vorzubeugen.",
                  },
                })}
                placeholder="*******"
              />
            </Field>
            {state.context.error ? (
              <ErrorMessage css={{ marginBlock: "$4" }}>
                {state.context.error}
              </ErrorMessage>
            ) : null}
            <Button css={{ marginTop: "$8" }} type="submit">
              Jetzt Registrieren
            </Button>
          </Form>
          <Text css={{ marginTop: "$6" }}>
            Sie haben bereits ein Konto?{" "}
            <Link href="/login">Dann melden Sie sich hier an.</Link>
          </Text>
        </Stack>
      </Stack>
    </MainContent>
  );
}
