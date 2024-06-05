import { RunnableSequence } from "@langchain/core/runnables";
import { LLMChain } from "langchain/chains";
import { Document } from "langchain/document";
import { formatDocumentsAsString } from "langchain/util/document";
import { pineconeIndex } from "./config";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";


export interface Context {
  role: "user" | "assistant" | "system";
  content: string;
}

const questionPrompt = PromptTemplate.fromTemplate(
  ` Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
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

const getChain = (promptType: "questionGenerator" | "question", apiKey: string) => {
  const chatModel = new ChatOpenAI({
    apiKey
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
  apiKey: string
}): Promise<{ result: string; sourceDocuments: Array<Document> }> => {
  const docs = input.context.map(
    (doc) =>
      new Document({
        metadata: doc.metadata,
        pageContent: doc.metadata.text as string,
      }),
  );
  const serializedDocs = formatDocumentsAsString(docs);

  const { text } = await getChain("questionGenerator", input.apiKey).invoke({
    chatHistory: input.chatHistory,
    context: serializedDocs,
    question: input.question,
  });

  const response = await getChain("question", input.apiKey).invoke({
    chatHistory: input.chatHistory,
    context: serializedDocs,
    question: text as string,
  });

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
) => {
  const chain = RunnableSequence.from([
    {
      question: (input: { question: string }) => input.question,
      chatHistory: async () => {
        return serializeChatHistory(context);
      },
      context: async (input: { question: string }) => {
        const embeddings = new OpenAIEmbeddings({
          openAIApiKey
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
      apiKey: () => openAIApiKey
    },
    performQuestionAnswering,
  ]);

  const response = await chain.invoke({
    question: message,
  });
  return response;
};