import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { Document } from "langchain/document";
import { formatDocumentsAsString } from "langchain/util/document";
import "server-only";
import { pineconeIndex } from "./config";
import { HttpResponseOutputParser } from "langchain/output_parsers";

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

const getChain = (apiKey: string) => {
  const parser = new HttpResponseOutputParser();
  const chatModel = new ChatOpenAI({
    apiKey,
    model: "gpt-4o-mini",
    streaming: true,
  });

  const prompt = questionPrompt;
  const chain = prompt.pipe(chatModel).pipe(parser);

  return chain;
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

export function converse(
  message: string,
  context: Context[],
  idArray: string[],
  openAIApiKey: string,
  isAskRipeseedChat: boolean = false,
) {
  return new ReadableStream({
    async start(controller) {
      const question = message;

      const chatHistory = await serializeChatHistory(context);

      const embeddings = new OpenAIEmbeddings({ openAIApiKey });
      const vector = await embeddings.embedQuery(question);
      const docs = await pineconeIndex.query({
        vector,
        topK: 5,
        filter: { id: { $in: idArray } },
        includeMetadata: true,
      });

      const serializedDocs = formatDocumentsAsString(
        docs.matches.map(
          (doc) =>
            new Document({
              metadata: doc.metadata,
              pageContent: doc.metadata?.text?.toString() || "",
            }),
        ),
      );

      const questionGeneratorInput = {
        chatHistory,
        context: serializedDocs,
        question,
        instructions: isAskRipeseedChat ? instructions : "",
      };

      const stream = await getChain(openAIApiKey).stream(questionGeneratorInput);

      for await (const chunk of stream) {
        const data = new TextDecoder().decode(chunk);
        controller.enqueue(data);
      }

      controller.close();
    }
  });
}
