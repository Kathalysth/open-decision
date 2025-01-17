import { MultiSelectInputRenderer } from "./ui/MultiSelectRenderer";
import {
  MultiSelectInputConfigurator,
  MultiSelectInputPrimaryActionSlot,
} from "./ui/MultiSelectEditor";
import { MultiSelectInputPlugin } from "./multiSelectPlugin";

export * from "./multiSelectPlugin";

const plugin = new MultiSelectInputPlugin();

export const MultiSelectInputPluginObject = {
  plugin,
  type: plugin.typeName,
  BuilderComponent: {
    InputConfigurator: MultiSelectInputConfigurator,
    PrimaryActionSlot: MultiSelectInputPrimaryActionSlot,
  },
  RendererComponent: MultiSelectInputRenderer,
};
