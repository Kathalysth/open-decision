import {
  darkTheme,
  defaultTheme,
  DropdownMenu,
  Icon,
  Link,
  StyleObject,
} from "@open-decision/design-system";
import {
  ArrowLeftIcon,
  Pencil2Icon,
  Share2Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { MenuButton } from "components/Header/MenuButton";
import { DeleteTreeDialog } from "features/Dashboard/components/Dialogs/DeleteTreeDialog";
import { UpdateTreeDialog } from "features/Dashboard/components/Dialogs/UpdateTreeDialog";
import { useGetTreeNameQuery } from "features/Data/generated/graphql";
import { useTreeId } from "features/Data/useTreeId";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { ExportDialog } from "./ExportDialog";

type Props = { css?: StyleObject };

export function ProjectMenu({ css }: Props) {
  const id = useTreeId();
  const router = useRouter();

  const { data } = useGetTreeNameQuery({ uuid: id });

  const name = data?.decisionTree?.name ?? "Kein Name";

  return (
    <DropdownMenu.Root
      dialogs={{
        export: (
          <ExportDialog
            className={defaultTheme}
            css={{ groupColor: "$black" }}
          />
        ),
        update: (
          <UpdateTreeDialog
            className={defaultTheme}
            treeId={id}
            css={{ groupColor: "$black" }}
          />
        ),
        delete: (
          <DeleteTreeDialog
            className={defaultTheme}
            css={{ groupColor: "$black" }}
            tree={{ uuid: id, name }}
            onDelete={() => router.push("/")}
          />
        ),
      }}
    >
      <DropdownMenu.Trigger asChild>
        <MenuButton label={name} css={css} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        sideOffset={15}
        alignOffset={-4}
        className={darkTheme}
        css={{ groupColor: "$white" }}
      >
        <DropdownMenu.Item>
          <Icon>
            <ArrowLeftIcon />
          </Icon>
          <NextLink href="/" passHref>
            <Link>Zurück zum Dashboard</Link>
          </NextLink>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <UpdateTreeDialog treeId={id}>
          <DropdownMenu.DialogItem dialogKey="update">
            <Icon>
              <Pencil2Icon />
            </Icon>
            Namen ändern
          </DropdownMenu.DialogItem>
        </UpdateTreeDialog>
        <DropdownMenu.DialogItem dialogKey="export">
          <Icon>
            <Share2Icon />
          </Icon>
          Exportieren
        </DropdownMenu.DialogItem>
        <DropdownMenu.DialogItem
          dialogKey="delete"
          css={{ colorScheme: "danger" }}
        >
          <Icon>
            <TrashIcon />
          </Icon>
          Projekt löschen
        </DropdownMenu.DialogItem>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
