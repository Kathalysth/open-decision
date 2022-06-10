import { ClientConfig, Get, safeFetch } from "@open-decision/api-helpers";
import { publishedTreesCollection } from "../../../urls";
import { TGetPublishedTreesInput } from "./input";
import { getPublishedTreesOutput, TGetPublishedTreesOutput } from "./output";

export const getPublishedTree =
  (
    context: ClientConfig
  ): Get<TGetPublishedTreesInput, TGetPublishedTreesOutput> =>
  async (inputs, config) => {
    let combinedUrl = publishedTreesCollection;
    const prefix = config?.urlPrefix ?? context.urlPrefix;

    if (prefix) combinedUrl = prefix + combinedUrl;

    // if (inputs.query) {
    //   combinedUrl = combinedUrl + `?${new URLSearchParams(inputs.query)}`;
    // }

    return await safeFetch(
      combinedUrl,
      { headers: context.headers },
      { validation: getPublishedTreesOutput }
    );
  };
