import { store } from "@/app/_utils/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { BookOpenCheck } from "lucide-react";
import { useEffect, useState } from "react";

const cards = [
  {
    content: "What are Ḥasan Ibn al-Haytham's contributions?",
  },
  {
    content: "Tell me a fun fact.",
  },
  {
    content: "Explain Algebra.",
  },
];

interface Props {
  sendMessage: (newMessage: string) => Promise<boolean>;
}

export const WelcomeCards = ({ sendMessage }: Props) => {
  const { set, useSnapshot } = store;
  const { openAIKey } = useSnapshot();
  const [key, setKey] = useState<string>("");
  const handleSendMessage = (i: number) => {
    const userPrompt = cards[i].content;
    sendMessage(userPrompt);
  };

  useEffect(() => {
    set("openAIKey", localStorage.getItem("openai:key") ?? "");
    setKey(openAIKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAIKey]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex max-w-[500px] flex-col gap-4 md:w-[500px]">
        {!key.length ? <Note className="w-full cursor-pointer" /> : null}
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <Card
            className="flex h-24 w-full cursor-pointer items-center justify-center bg-white p-2 text-gray-500 shadow-none hover:bg-gray-100"
            onClick={() => handleSendMessage(0)}
          >
            {cards[0].content}
          </Card>
          <div className="flex w-full flex-row gap-2">
            <Card
              className="flex h-24 w-full cursor-pointer items-center justify-center bg-white p-2 text-gray-500 shadow-none hover:bg-gray-100"
              onClick={() => handleSendMessage(1)}
            >
              {cards[1].content}
            </Card>
            <Card
              className="flex h-24 w-full cursor-pointer items-center justify-center bg-white p-2 text-gray-500 shadow-none hover:bg-gray-100"
              onClick={() => handleSendMessage(2)}
            >
              {cards[2].content}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Note = ({ className }: { className?: string }) => {
  const { set } = store;
  const handleOpenConfig = () => {
    set("isConfigOpen", true);
  };
  return (
    <Alert variant="info" className={className} onClick={handleOpenConfig}>
      <AlertDescription className="flex flex-row gap-2">
        <BookOpenCheck className="mt-0.5 h-4 w-4" />
        Configure your OpenAI Key from gear icon at top-right to continue.
      </AlertDescription>
    </Alert>
  );
};
