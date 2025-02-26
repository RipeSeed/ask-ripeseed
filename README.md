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
| react-syntax-highlighter | Syntax Highlighting     | v15.5.0  | Provides syntax highlighting for code snippets and markdown content.                       |
| rehype-highlight         | Markdown Parser         | v7.0.0   | A plugin for Rehype to highlight code blocks in markdown.                                  |
| rehype-katex             | Math Rendering          | v7.0.0   | A plugin for Rehype to render math expressions using KaTeX.                                |     |
| lodash                   | Utility Library         | v4.17.21 | A modern JavaScript utility library delivering modularity, performance, and extras.        |
| eslint                   | Linting                 | v8       | A pluggable linting utility for JavaScript and TypeScript.                                 |
| prettier                 | Code Formatter          | v3.3.3   | An opinionated code formatter that supports many languages.                                |

Additional dependencies include several Radix UI components, libraries for state management, syntax highlighting, and markdown rendering to enhance the functionality and user interface of the chatbot.

## Documentation

### Dashboard Configuration

We are excited to introduce a new dashboard that allows users to easily configure various aspects of the Ask RipeSeed application. You can access the dashboard via the `/dashboard` route. 

If there are no users in the database, you will be first navigated to the registration page. This is a one-time process, and after completing registration, you will not be able to access the registration route again.

With this dashboard, you can manage:

- **Models**: Select and configure the AI models used for responses.
- **Pinecone**: Set up and manage your Pinecone index for efficient data storage and retrieval.
- **Calendly**: Integrate your Calendly link for seamless scheduling.
- **Prompts**: Customize the prompts used by the AI to tailor responses to your needs.
- **Knowledge Base**: Upload and manage your knowledge base documents directly from the dashboard.

This new feature simplifies the setup process and enhances the overall user experience, making it easier to customize the AI assistant to fit your specific requirements.

## Encryption

For security purposes, sensitive data is encrypted. For detailed information about the encryption methods implemented in this project, please refer to the [ENCRYPTION.md](ENCRYPTION.md) file located in the root of the project.

## Running the Application

To run Ask RipeSeed locally, follow these steps:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/RipeSeed/ask-ripeseed
   cd ask-ripeseed
   ```

2. **Set Up Environment Variables**: Add the following environment variables to your `.env` file:

   - `MONGO_CONNECTION_STRING`: Your MongoDB connection string.
   - `NEXT_PUBLIC_GA_ID`: Google Analytics ID.
   - `PINECONE_INDEX`: Your Pinecone index name.
   - `NEXT_PUBLIC_CALENDLY`: Your calendly link.
   - `ENCRYPTION_KEY`: Your encryption key for securing sensitive data.
   - `JWT_SEC`: Your JSON Web Token secret for authentication.
   - `AUTH_SECRET`: Your authentication secret key.
   - `BASE_URL`: The base URL of your application.

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
