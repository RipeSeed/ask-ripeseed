import {  OpenAIEmbeddings } from '@langchain/openai'
import { Document } from 'langchain/document'
import { formatDocumentsAsString } from 'langchain/util/document'

import 'server-only'

import { pineconeIndex } from './config'
import { OpenAI } from 'openai'

export interface Context {
  role: 'system' | 'user' | 'assistant' | 'tool' | 'function';
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
  Note: If user asks something NOT related to ripeseed, like any code snippet any other general question excuse them politely and ask them to ask the relevant questions regarding ripeseed.
`

const tools:  OpenAI.Chat.ChatCompletionTool[] = [
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

const getChain = async (questionGeneratorInput: QuestionGeneratorInput, isOpenAi: boolean) => {

  const openai = isOpenAi ? new OpenAI() : new OpenAI({
    baseURL: process.env.DEEPSEEK_BASE_URL,
    apiKey: process.env.DEEPSEEK_API_KEY
  });

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
      role: "system" as const,
      content: instructions
    },
    { role: "user" as const, content: finalPrompt }
  ];

  const stream: any = await openai.chat.completions.create({
    model: isOpenAi ? 'gpt-4o-mini' : 'deepseek-chat',
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
  isOpenAi: boolean = true,
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

      const stream = await getChain(questionGeneratorInput, isOpenAi)
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
      }

      controller.close()
    },
  })
}
