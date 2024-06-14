import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { Document } from "langchain/document";
import { formatDocumentsAsString } from "langchain/util/document";
import "server-only";
import { pineconeIndex } from "./config";

export interface Context {
  role: "user" | "assistant" | "system";
  content: string;
}

const instructions = `
  Act like an agent from RipeSeed, a software services company and answer the user queries accordingly.
  If a user asks if we have worked with particular technology/niche, check if its available in the context and give answers accordingly
  If a user asks if we have worked with a particular technology/niche, and it's not available in the context, check if a similar/niche technology is available in the context and present that to the user
  If you need more information about the technologies client is looking for, feel free to ask them and narrow down the client's requirements before checking the context.
  If a user asks for bugdet/timeline for a project ask them to schedule a call with ripeseed representative
  In your response do not intimate the steps or logic you are following to conclude the answer
`;

const questionPrompt = PromptTemplate.fromTemplate(
  ` Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------
INSTRUCTIONS: {instructions}
----------
CONTEXT: {context}
----------
CHAT HISTORY: {chatHistory}
----------
QUESTION: {question}
----------
Helpful Answer:`,
);
const questionGeneratorTemplate = PromptTemplate.fromTemplate(
  `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.
----------
CHAT HISTORY: {chatHistory}
----------
FOLLOWUP QUESTION: {question}
----------
Standalone question:`,
);

const getChain = (
  promptType: "questionGenerator" | "question",
  apiKey: string,
) => {
  const chatModel = new ChatOpenAI({
    apiKey,
  });
  const chain = new LLMChain({
    llm: chatModel,
    prompt:
      promptType === "questionGenerator"
        ? questionGeneratorTemplate
        : questionPrompt,
  });
  return chain;
};

const performQuestionAnswering = async (input: {
  question: string;
  chatHistory: string;
  context: Array<Document>;
  apiKey: string;
  isAskRipeseedChat: boolean;
}): Promise<{ result: string; sourceDocuments: Array<Document> }> => {
  const docs = input.context.map(
    (doc) =>
      new Document({
        metadata: doc.metadata,
        pageContent: doc.metadata.text as string,
      }),
  );
  const serializedDocs = formatDocumentsAsString(docs);

  const questionGeneratorInput: {
    chatHistory: string;
    context: string;
    question: string;
    instructions?: string;
  } = {
    chatHistory: input.chatHistory,
    context: serializedDocs,
    question: input.question,
  };
  input.isAskRipeseedChat
    ? (questionGeneratorInput["instructions"] = instructions)
    : (questionGeneratorInput["instructions"] = "");
  const { text } = await getChain("questionGenerator", input.apiKey).invoke(
    questionGeneratorInput,
  );

  const questionInput: {
    chatHistory: string;
    context: string;
    question: string;
    instructions?: string;
  } = {
    chatHistory: input.chatHistory,
    context: serializedDocs,
    question: text as string,
  };
  input.isAskRipeseedChat
    ? (questionInput["instructions"] = instructions)
    : (questionInput["instructions"] = "");

  const response = await getChain("question", input.apiKey).invoke(
    questionInput,
  );

  return {
    result: response.text as string,
    sourceDocuments: input.context,
  };
};

const serializeChatHistory = (chatHistory: Context[]): string => {
  return chatHistory
    .map((chatMessage) => {
      if (chatMessage.role === "user") {
        return `Human: ${chatMessage.content}`;
      } else if (chatMessage.role === "assistant") {
        return `Assistant: ${chatMessage.content}`;
      } else {
        return `${chatMessage.content}`;
      }
    })
    .join("\n");
};

export const converse = async (
  message: string,
  context: Context[],
  idArray: string[],
  openAIApiKey: string,
  isAskRipeseedChat: boolean = false,
) => {
  const chain = RunnableSequence.from([
    {
      question: (input: { question: string }) => input.question,
      chatHistory: async () => {
        return serializeChatHistory(context);
      },
      context: async (input: { question: string }) => {
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey,
        });
        const vector = await embeddings.embedQuery(input.question);
        const docs = await pineconeIndex.query({
          vector,
          topK: 4,
          filter: { id: { $in: idArray } },
          includeMetadata: true,
        });
        return docs.matches;
      },
      apiKey: () => openAIApiKey,
      isAskRipeseedChat: () => isAskRipeseedChat,
    },
    performQuestionAnswering,
  ]);

  const response = await chain.invoke({
    question: message,
  });
  return response;
};
