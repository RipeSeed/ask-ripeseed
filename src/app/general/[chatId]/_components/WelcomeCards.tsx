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
  const [openAIKey, setOpenAIKey] = useState("");
  const handleSendMessage = (i: number) => {
    const userPrompt = cards[i].content;
    sendMessage(userPrompt);
  };

  useEffect(() => {
    setOpenAIKey(localStorage.getItem("openai:key") ?? "");
  }, []);

  return (
    <div className="flex justify-center items-center h-full flex-col gap-4">
      <div className="max-w-[500px] md:w-[500px] flex flex-col gap-4">
        {openAIKey.length === 0 && <Note className="w-full" />}
        <div className="flex justify-center items-center flex-col gap-2 w-full">
          <Card
            className="bg-white shadow-none hover:bg-gray-100 cursor-pointer h-24 flex justify-center w-full items-center p-2 text-gray-500"
            onClick={() => handleSendMessage(0)}>
            {cards[0].content}
          </Card>
          <div className="flex flex-row gap-2 w-full">
            <Card
              className="bg-white shadow-none hover:bg-gray-100 cursor-pointer h-24 flex justify-center w-full items-center p-2 text-gray-500"
              onClick={() => handleSendMessage(1)}>
              {cards[1].content}
            </Card>
            <Card
              className="bg-white shadow-none hover:bg-gray-100 cursor-pointer h-24 flex justify-center w-full items-center p-2 text-gray-500"
              onClick={() => handleSendMessage(2)}>
              {cards[2].content}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Note = ({ className }: { className?: string }) => {
  return (
    <Alert variant="info" className={className}>
      <AlertDescription className="flex flex-row gap-2">
        <BookOpenCheck className="h-4 w-4 mt-0.5" />
        Configure your OpenAI Key from gear icon at top-right to continue.
      </AlertDescription>
    </Alert>
  );
};
