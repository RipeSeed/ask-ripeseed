import { Message } from "@/app/_lib/db";

type APIRequest = {
  message: Message;
  apiKey?: string | undefined;
};

export const sendMessage = async ({
  message,
  apiKey = "",
}: APIRequest): Promise<Message> => {
  try {
    if (!apiKey?.length || !message.content?.length) {
      throw new Error("APi key required");
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      apiKey,
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

    const response = await fetch(`/api/chat`, requestOptions);
    const resObject: { data: Message } = await response.json();

    return resObject.data;
  } catch (err) {
    if (err instanceof Error) {
      throw err.message;
    }
    throw "Something went wrong";
  }
};
