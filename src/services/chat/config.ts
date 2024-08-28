import 'server-only'

import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})
// const model = new OpenAI({ temperature: 0, model: "gpt-3.5-turbo-16k" });
// const chatModel = new ChatOpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!)

export {
  // model,
  pineconeIndex,
}
