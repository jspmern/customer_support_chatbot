import { vectorStore } from "../service/indexing";
import { createRetrieverTool } from "@langchain/classic/tools/retriever";

const retriever = vectorStore.asRetriever();


export const retrieve_lerning_tool = createRetrieverTool(
  retriever,
  {
    name: "retrieve_lerning_tool",
    description:
      "Search and return the relevent datat",
  },
);