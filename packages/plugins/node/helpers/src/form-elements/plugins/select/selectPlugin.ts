import { TTreeClient } from "@open-decision/tree-type";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { SingleSelectVariablePlugin } from "@open-decision/plugins-variable-select";
import { Answer, InputPlugin, TAnswer } from "../../helpers";

export const typeName = "select" as const;

export const DataType = z
  .object({
    answers: z.array(Answer),
    label: z.string().optional(),
    required: z.boolean(),
  })
  .default({ answers: [], required: false });

export type TSelectInput = z.infer<SelectInputPlugin["Type"]>;
const SingleSelectVariable = new SingleSelectVariablePlugin();

export class SelectInputPlugin extends InputPlugin<
  typeof DataType,
  typeof typeName,
  typeof SingleSelectVariable
> {
  constructor() {
    super(DataType, typeName, SingleSelectVariable);
    this.defaultData = { answers: [], required: false };
  }

  createAnswer(answer: Pick<TAnswer, "value">) {
    return { id: uuid(), ...answer };
  }

  getAnswer = (input: TSelectInput, answerId: string) => {
    return input.data.answers?.find(({ id }) => id === answerId);
  };

  addAnswer =
    (inputId: string, answer: TAnswer) => (treeClient: TTreeClient) => {
      const input = this.getInput(inputId)(treeClient);

      if (!input) return;

      if (!input.data.answers) input.data.answers = [];

      input.data.answers.push(answer);
    };

  updateAnswer =
    (inputId: string, answerId: string, newValue: string) =>
    (treeClient: TTreeClient) => {
      const input = this.getInput(inputId)(treeClient);
      if (!input) return;

      const answer = this.getAnswer(input, answerId);

      if (!answer) return;

      answer.value = newValue;
    };

  reorderAnswers =
    (inputId: string, newAnswers: TAnswer[]) => (treeClient: TTreeClient) => {
      const input = treeClient.pluginEntity.get.single<typeof this.Type>(
        "inputs",
        inputId
      );

      if (!input) return;

      input.data.answers = newAnswers;
    };

  deleteAnswer =
    (inputId: string, answerId: string) => (treeClient: TTreeClient) => {
      const input = this.getInput(inputId)(treeClient);

      const answerIndex = input.data.answers?.findIndex(
        ({ id }) => id === answerId
      );

      if (!(answerIndex !== null)) return;

      input.data.answers?.splice(answerIndex, 1);
    };

  updateTarget =
    ({
      nodeId,
      newItem,
      edgeId,
    }: {
      nodeId: string;
      newItem: string;
      edgeId?: string;
    }) =>
    (treeClient: TTreeClient) => {
      const edge = edgeId ? treeClient.edges.get.single(edgeId) : undefined;

      if (edge instanceof Error) throw edge;

      if (!edge?.target && newItem) {
        const newEdge = treeClient.edges.create({
          source: nodeId,
          target: newItem,
        });

        if (newEdge instanceof Error) return;

        treeClient.edges.add(newEdge);
      }

      if (edge?.target && newItem)
        treeClient.edges.connect.toTargetNode(edge.id, newItem);
    };

  getInputsWithAnswers = (
    inputs: TSelectInput[]
  ): Record<string, TSelectInput> | undefined => {
    if (!inputs) return undefined;

    const filteredInputs = Object.values(inputs).reduce(
      function filterInputsWithoutAnswer(previousValue, input) {
        if ((input.data.answers?.length ?? 0) > 0)
          previousValue[input.id] = input;

        return previousValue;
      },
      {} as Record<string, TSelectInput>
    );

    if (Object.values(filteredInputs).length === 0) return undefined;

    return filteredInputs;
  };
}
