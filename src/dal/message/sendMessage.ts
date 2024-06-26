import { Message } from "@/app/_lib/db";
import { getChatContext } from "@/app/_lib/db";

type APIRequest = {
  message: Message;
  apiKey?: string | undefined;
  indexId?: string | null;
  chatId: number;
};

export const sendMessage = async ({
  message,
  apiKey = "",
  indexId = null,
  chatId,
}: APIRequest): Promise<Message> => {
  try {
    if (!apiKey?.length || !message.content?.length) {
      throw new Error("APi key required");
    }
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const context = await getChatContext({
      chatId,
    });

    const raw = JSON.stringify({
      apiKey,
      indexId,
      messages: [
        ...context,
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

    const response = await fetch(`/api/chat/send-message`, requestOptions);
    if (response.ok === false) {
      const err = await response.text();
      throw new Error(err);
    }
    const resObject: { data: Message } = await response.json();

    return resObject.data;
  } catch (err) {
    if (err instanceof Error) {
      throw { message: err.message, status: 400 };
    }
    throw { message: "Something went wrong", status: 500 };
  }
};
