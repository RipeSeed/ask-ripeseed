import { Message } from "@/app/_lib/db";

type APIRequest = {
  message: Message;
  apiKey?: string | undefined;
  indexId?: string | null;
};

export const askRS_sendMessage = async ({
  message,
}: APIRequest): Promise<Message> => {
  try {
    if (!message.content?.length) {
      throw new Error("message cannot be empty");
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      messages: [
        {
          role: "user",
          content: message.content,
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: raw,
    };

    const response = await fetch(`/api/chat/ask-ripeseed`, requestOptions);
    const resObject: { data: Message } = await response.json();

    return resObject.data;
  } catch (err) {
    if (err instanceof Error) {
      throw err.message;
    }
    throw "Something went wrong";
  }
};
