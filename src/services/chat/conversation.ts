import { PromptTemplate } from '@langchain/core/prompts'
import {  OpenAIEmbeddings } from '@langchain/openai'
import { Document } from 'langchain/document'
import { formatDocumentsAsString } from 'langchain/util/document'
import { CacheGet, CacheSet, CacheClient, Configurations, CredentialProvider } from '@gomomento/sdk';

import 'server-only'

import { pineconeIndex } from './config'
import { OpenAI } from 'openai'

export interface Context {
  role: 'user' | 'assistant' | 'system'
  content: string
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
`

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
)

const tools = [
  {
    "type": "function",
    "function": {
      "name": "book_meeting_call_appointment",
      "description": "If someone wants to talk, books calls, meetings, appointments, or any meet-up with RipeSeed",
      "parameters": {
        "type": "object",
        "properties": {},
        "required": []
      }
    }
  }
]

interface QuestionGeneratorInput {
  instructions: string;
  context: string;
  chatHistory?: string;
  question: string;
}

const initializeCache = async () => {
  const client = new CacheClient({
    configuration: Configurations.Laptop.v1(),
    credentialProvider: CredentialProvider.fromEnvironmentVariable({
      environmentVariableName: 'MOMENTO_API_KEY',
    }),
    defaultTtlSeconds: 60 * 60 * 24,
  });

  return client
  // ('no-ask-ripeseed');
};

const getChain = async (questionGeneratorInput: QuestionGeneratorInput) => {
  const cache = await initializeCache();
  const cacheKey = `openai:${questionGeneratorInput}`;

  // Try to get the response from cache
  const cacheResult = await cache.get('no-ask-ripeseed', cacheKey);
  console.log("cacheResult", cacheResult);

  if (cacheResult instanceof CacheGet.Hit) {
    console.log('Cache hit!');
    return cacheResult.valueString();
  }

  const openai = new OpenAI();

  const finalPrompt =
    `Use the following pieces of context to answer the question at the end.
    ----------
    CONTEXT: ${questionGeneratorInput.context}
    ----------
    CHAT HISTORY: ${questionGeneratorInput?.chatHistory}
    ----------
    QUESTION: ${questionGeneratorInput.question}
    ----------
    Helpful Answer:`

  const messages = [
    {
      role: "system",
      content: instructions
    },
    { role: "user", content: finalPrompt }
  ];

  const stream: any = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,
    stream: true,
    temperature: 0,
    tools: tools,
    tool_choice: "auto"
  });

  return stream
}

const serializeChatHistory = (chatHistory: Context[]): string => {
  return chatHistory
    .map((chatMessage) => {
      if (chatMessage.role === 'user') {
        return `Human: ${chatMessage.content}`
      } else if (chatMessage.role === 'assistant') {
        return `Assistant: ${chatMessage.content}`
      } else {
        return `${chatMessage.content}`
      }
    })
    .join('\n')
}

export function converse(
  message: string,
  context: Context[],
  idArray: string[],
  openAIApiKey: string,
  isAskRipeseedChat: boolean = false,
) {
  return new ReadableStream({
    async start(controller) {
      const question = message

      const chatHistory = await serializeChatHistory(context)

      const embeddings = new OpenAIEmbeddings({ openAIApiKey })
      const vector = await embeddings.embedQuery(question)

      let serializedDocs = ''

      if (idArray[0] !== null) {
        const docs = await pineconeIndex.query({
          vector,
          topK: 5,
          filter: { id: { $in: idArray } },
          includeMetadata: true,
        })

        serializedDocs = formatDocumentsAsString(
          docs.matches.map(
            (doc) =>
              new Document({
                metadata: doc.metadata,
                pageContent: doc.metadata?.text?.toString() || '',
              }),
          ),
        )
      }

      const questionGeneratorInput: QuestionGeneratorInput = {
        chatHistory,
        context: serializedDocs,
        question,
        instructions: isAskRipeseedChat ? instructions : '',
      }

      const stream = await getChain(questionGeneratorInput)
      let completeMessage = '';
      for await (const chunk of stream) {
        if (chunk.choices[0]?.delta?.content) {
          const content = chunk.choices[0].delta.content;
          controller.enqueue(content);
          completeMessage += content;
        }

        if (chunk.choices[0]?.delta?.tool_calls) {
          const toolCalls = chunk.choices[0].delta.tool_calls;
          if (Array.isArray(toolCalls) && toolCalls.length > 0) {
            if (toolCalls[0].function?.name === "book_meeting_call_appointment") {
              controller.enqueue("BOOK_MEETING");
            }
          }
        }
        const cache = await initializeCache();
        const result = await cache.set('no-ask-ripeseed', `openai:${questionGeneratorInput.question}`, completeMessage);
        console.log(`result`, result)

      }

      controller.close()
    },
  })
}
