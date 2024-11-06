import React, { useEffect } from 'react';
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { MessageMarkdownMemoized } from "./MessageMarkdownMemoized";

interface ShowMessageProps {
  message: string;
  components: object;
}

const ShowMessage: React.FC<ShowMessageProps> = ({ message, components }) => {
  useEffect(() => {
    if (message === "BOOK_MEETING") {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [message]);

  if (message === "BOOK_MEETING") {
    return (
      <div className="w-full max-w-[1000px] mx-auto overflow-hidden rounded-xl min-w-full">
        <div
          className="calendly-inline-widget relative h-[500px] pb-[100%] sm:pb-[75%] w-[285px] sm:w-[300px] md:w-[420px]"
          data-url={process.env.NEXT_PUBLIC_CALENDLY}
        />
      </div>
    );
  } else {
    return (
      <MessageMarkdownMemoized
        className="rounded-xl p-3 prose dark:prose-invert bg-white dark:bg-black prose-p:leading-relaxed prose-pre:p-0 min-w-full space-y-6"
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={components}
      >
        {message}
      </MessageMarkdownMemoized>
    );
  }
};

export default ShowMessage;