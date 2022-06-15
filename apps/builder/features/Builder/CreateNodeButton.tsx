import {
  Button,
  Icon,
  StyleObject,
  Text,
  Tooltip,
} from "@open-decision/design-system";
import { PlusIcon } from "@radix-ui/react-icons";
import { useTreeContext } from "./state/treeStore/TreeContext";
import { useEditor } from "./state/useEditor";

type Props = { css?: StyleObject };

export function CreateNodeButton({ css }: Props) {
  const {
    createInput,
    createAnswer,
    createNode,
    addNode,
    addInput,
    addInputAnswer,
  } = useTreeContext();

  const { getCenter, zoomToNode } = useEditor();
  const { replaceSelectedNodes } = useTreeContext();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button
          square
          css={{ boxShadow: "$2", ...css }}
          onClick={() => {
            const newInput = createInput();
            const newAnswer = createAnswer({ text: "" });

            const newNode = createNode({
              data: { inputs: [newInput.id], conditions: [] },
              position: getCenter(),
            });

            addNode(newNode);
            addInput(newInput);
            addInputAnswer(newInput.id, newAnswer);

            replaceSelectedNodes([newNode.id]);
            zoomToNode(newNode);
          }}
        >
          <Icon>
            <PlusIcon />
          </Icon>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={15}>
        <Text>Neuen Knoten hinzufügen</Text>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}