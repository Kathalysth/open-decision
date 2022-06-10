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
import { MenuButton } from "../../../components/Header/MenuButton";
import { DeleteTreeDialog } from "../../../features/Dashboard/components/Dialogs/DeleteTreeDialog";
import { UpdateTreeDialog } from "../../../features/Dashboard/components/Dialogs/UpdateTreeDialog";
import { useTreeId } from "../../../features/Data/useTreeId";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { ExportDialog } from "./ExportDialog";
import { useTreeQuery } from "../../Data/useTreeQuery";

type Props = { css?: StyleObject };

export function ProjectMenu({ css }: Props) {
  const uuid = useTreeId();
  const router = useRouter();

  const { data } = useTreeQuery(uuid);

  const name = data?.name ?? "Kein Name";

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
            treeId={uuid}
            css={{ groupColor: "$black" }}
          />
        ),
        delete: (
          <DeleteTreeDialog
            className={defaultTheme}
            css={{ groupColor: "$black" }}
            tree={{ uuid, name }}
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
        <NextLink href="/" passHref>
          <DropdownMenu.Item asChild>
            <Link>
              <Icon>
                <ArrowLeftIcon />
              </Icon>
              Zurück zum Dashboard
            </Link>
          </DropdownMenu.Item>
        </NextLink>
        <DropdownMenu.Separator />
        <UpdateTreeDialog treeId={uuid}>
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
