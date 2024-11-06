<h1 align="center">Ask RipeSeed - An AI Assistant <i>for agencies</i></h1>

<div align="center">
<a href="https://ask.ripeseed.io/">
    <img src="https://img.shields.io/badge/Demo-Ask_RipeSeed-green" height="20" />
</a>
<a href="https://github.com/RipeSeed/ask-ripeseed/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" height="20"/>
</a>
<a href="https://www.linkedin.com/company/ripeseed/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" height="20"/>
</a>
<a href="https://www.langchain.com/">
    <img src="https://img.shields.io/badge/langchain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" height="20" />
</a>
<a href="https://github.com/RipeSeed/ask-ripeseed">
    <img src="https://img.shields.io/github/stars/RipeSeed/ask-ripeseed" height="20" />
</a>
</div>

Ask RipeSeed was originally developed to help potential customers see if our team (at [RipeSeed](https://www.linkedin.com/company/ripeseed)) has the required capabilities to help them with their projects. Any customer can ask about what they are looking for, and the AI assistant will respond back with relevant portfolios <i>(if any)</i> to showcase our capabilities to deliver that project.

![hero](https://github.com/RipeSeed/ask-ripeseed/blob/main/public/ask-rs-landing.png)

## Overview

Ask RipeSeed consists of two main sections:

- **Ask RipeSeed**: Ask any questions related to RipeSeed, drawing from our knowledge base for accurate and specific answers.
- **Ask Anything**: Upload your OpenAI API key (which will be stored locally on browser) to ask general questions. This section also allows you to upload and attach your own documents, enabling the chatbot to answer based on the content of the provided documents.

## Features

- 🌗 Dark/Light Mode Support 
- 📝 Markdown support  
- 💬 Chat history 
- 📚 Attach custom knowledgebase 
- 📅 Function calling support to book meetings 

## Demo

Try the deployed application on the link [here](https://ask.ripeseed.io). "Ask RipeSeed" tab is free to use but make sure to add your openai key (stored locally in the browser) to explore "Ask Anything" section.

## Tech Stack

Ask RipeSeed utilizes a modern and efficient tech stack to deliver a robust user experience. Below is an overview of the core libraries and tools used in the project:

| Library                  | Category                | Version  | Description                                                                                |
| ------------------------ | ----------------------- | -------- | ------------------------------------------------------------------------------------------ |
| Next.js                  | Web Framework           | v14.2.3  | A powerful React framework for building scalable web applications.                         |
| TypeScript               | Language                | v5       | Provides static type checking to improve code quality and maintainability.                 |
| Tailwind CSS             | Styling Framework       | v3.4.1   | A utility-first CSS framework for rapidly building custom designs.                         |
| Ttanstack/react-query    | Data Fetching & Caching | v5.40.0  | A robust data-fetching and state management library for React applications.                |
| Langchain                | LLM Toolkit             | v0.2.6   | Toolkit for building applications using large language models like OpenAI's GPT.           |
| OpenAI                   | LLM Platform            | v4.47.1  | Provides natural language processing and AI-driven responses for the chatbot.              |
| Pinecone                 | Vector Database         | v2.2.1   | A scalable vector database for storing and querying high-dimensional data like embeddings. |
| Framer Motion            | Animation Library       | v11.2.6  | A library for creating smooth animations and transitions in React applications.            |
| Mongoose                 | MongoDB Object Modeling | v8.4.1   | An ODM (Object Data Modeling) library for MongoDB and Node.js.                             |
| Dexie                    | IndexedDB Wrapper       | v4.0.7   | A minimalistic wrapper for IndexedDB to handle local storage effectively.                  |
| PDF-parse                | Document Parsing        | v1.1.1   | Parses and processes PDF documents to extract content.                                     |
| Radix-ui                 | UI Components           | v1.0.x   | Provides a set of accessible and composable UI components for React.                       |
| Valtio                   | State Management        | v1.13.2  | A simple and efficient state management library for React.                                 |
| react-syntax-highlighter | Syntax Highlighting     | v15.5.0  | Provides syntax highlighting for code snippets and markdown content.                       |
| rehype-highlight         | Markdown Parser         | v7.0.0   | A plugin for Rehype to highlight code blocks in markdown.                                  |
| rehype-katex             | Math Rendering          | v7.0.0   | A plugin for Rehype to render math expressions using KaTeX.                                |
| @gomomento/sdk           | Caching                 | v1.93.0  | Provides a fast and scalable caching solution using Momento.                               |
| lodash                   | Utility Library         | v4.17.21 | A modern JavaScript utility library delivering modularity, performance, and extras.        |
| eslint                   | Linting                 | v8       | A pluggable linting utility for JavaScript and TypeScript.                                 |
| prettier                 | Code Formatter          | v3.3.3   | An opinionated code formatter that supports many languages.                                |

Additional dependencies include several Radix UI components, libraries for state management, syntax highlighting, and markdown rendering to enhance the functionality and user interface of the chatbot.

## Documentation

### Replacing the RipeSeed Knowledge Base

To customize the chatbot's responses with your own knowledge base, follow these steps to create and upload document chunks:

1. **Prepare Your Documents**: We have provided a [template](https://github.com/RipeSeed/ask-ripeseed/blob/main/public/example-docs/knowledgebase.template) and an [example document](https://github.com/RipeSeed/ask-ripeseed/blob/main/public/example-docs/knowledgebase) to start with and give agencies an idea on how should they create their knowledgebase. Use that or create your own document and place that in PDF format in the "Documents" folder located in the same directory as the chunking script.
2. **Run the Chunking Script**: Use our script located [here](https://github.com/RipeSeed/ask-ripeseed/blob/main/scripts/ask_ripeseed_LC_chunking.ipynb). This script is an `.ipynb` file that can be run locally using Jupyter Notebook or online via Google Colab.
3. **Configure the Script**: In the `upload_documents_service` function, set up the following variables:
   - `api_key`: Your Pinecone API key.
   - `pinecone.Index()`: Your Pinecone index name.
   - `openai_api_key`: Your OpenAI API key.
   - `id`: A hardcoded identifier in the metadata of vectors for distinguishing your documents in the vector database.
4. **Run the Script**: Execute all the cells in sequence. This will vectorize your documents and store them in Pinecone with the specified index and metadata.

## Running the Application

To run Ask RipeSeed locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/RipeSeed/ask-ripeseed
   cd ask-ripeseed
   ```

2. **Set Up Environment Variables**: Add the following environment variables to your `.env` file:

   - `MOMENTO_API_KEY`: Your Momento API key for caching (free).
   - `MONGO_CONNECTION_STRING`: Your MongoDB connection string.
   - `NEXT_PUBLIC_GA_ID`: Google Analytics ID.
   - `OPENAI_KEY`: Your OpenAI API key.
   - `PINECONE_API_KEY`: Your Pinecone API key.
   - `PINECONE_INDEX`: Your Pinecone index name.
   - `RIPESEED_DOC_INDEX_ID`: The hardcoded ID for your indexed document in Pinecone.
   - `RIPESEED_OPENAI_API_KEY`: OpenAI key for querying the knowledge base.
   - `NEXT_PUBLIC_CALENDLY`: Your calendly link.

3. **Install Dependencies**:

   ```bash
   pnpm install
   ```

4. **Run the Application Locally**:
   ```bash
   pnpm run dev
   ```

## Contributing

We here at RipeSeed have setup this open-source repository so that developers interested in making AI tools like this can have a starting point. They can clone the repo and get it up and running and with only a few tweaks they can set up their own AI assistants without having to invest their time setting up everything from scratch. We welcome contributions to the Ask RipeSeed! Whether it's bug fixes, feature enhancements, or documentation improvements, your input is valued.

## Got an AI idea? Looking for a team? Let's have a chat!

We are a team of super passionate developers, helping clients since 2021. We have worked with some amazing and brilliant customers and have built & launched various AI products for them. If you have an idea that you are planning to launch but don't have the engineering capacity, feel free to reach out to us at info@ripeseed.io. We are also aiming to launch interesting products and open source projects like these for the developer community, so stay tuned.

## Reporting Issues / Getting Help

For any issues or assistance, please check the issues and discussions sections on GitHub. You can also reach out to the RipeSeed community or contact us directly through our website.
