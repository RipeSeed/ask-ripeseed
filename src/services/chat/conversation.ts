import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import {  OpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { LLMChain } from "langchain/chains";
import { Document } from "langchain/document";
import { formatDocumentsAsString } from "langchain/util/document";
import "server-only";
import { pineconeIndex } from "./config";
import {
  CacheClient,
  Configurations,
  CredentialProvider,
} from "@gomomento/sdk";
import { MomentoCache } from "@langchain/community/caches/momento";

export interface Context {
  role: "user" | "assistant" | "system";
  content: string;
}

const instructions = `
  Act like an agent from RipeSeed, a software services company and answer the user queries accordingly.
  If a user asks if we can develop something they want to, mention the projects that are similar to the user's requirements as an example.
  If a user asks about particular technology/niche, check if its available in the context you have. IF available, give answers accordingly. ELSE IF NOT AVAILABLE in the context, check if a similar/niche technology is available in the context and present that to the user
  If you need more information about the technologies client is looking for, feel free to ask them and narrow down the client's requirements before checking the context.
  If a user asks for bugdet/timeline for a project ask them to schedule a call with ripeseed representative and also give them the RipeSee's Contact Us and Get a Quote links (https://ripeseed.io/request-a-quote).
  In your response do not include the steps or logic you are taking to conclude the answer.
  Your responses should include the relevant information and not the words like context, chat history, etc.
  If you are mentioning multiple projects, mention them as a numbered list ONLY IF there are multiple projects.
  Make sure assistant response is ALWAYS in markdown format.
  Provide a paragraph where necessary, List where necessary, and code block with code language for syntax highlighting where code is needed.
  Note: If user asks something NOT related to ripeseed, excuse them politely and ask them to ask the relevant questions.
`;

const questionPrompt = PromptTemplate.fromTemplate(
  `Use the following pieces of context to answer the question at the end.
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


async function initializeCache() {
  console.log("hi", process.env.NEXT_PUBLIC_MOMENTO_API_KEY)
  const client = new CacheClient({
    configuration: Configurations.Laptop.v1(),
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: "MOMENTO_API_KEY"
    }),
    defaultTtlSeconds: 60 * 60 * 24,
  });

  const cache = await MomentoCache.fromProps({
    client,
    cacheName: "ask-ripeseed",
  });

  return cache;
}

async function getChain(
  promptType: "questionGenerator" | "question",
  apiKey: string,
) {
  const cache = await initializeCache(); // Wait for the cache to be ready

  const chatModel = new OpenAI({
    cache,
    apiKey,
    model: "gpt-4o-mini",
  });

  const chain = new LLMChain({
    llm: chatModel,
    prompt:
      promptType === "questionGenerator"
        ? questionGeneratorTemplate
        : questionPrompt,
  });

  return chain;
}

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
  const { text } = await (await getChain("question", input.apiKey)).invoke(
    questionGeneratorInput,
  );

  return {
    result: text as string,
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
          topK: 5,
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
