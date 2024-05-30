import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { BookOpenCheck } from "lucide-react";

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
  const handleSendMessage = (i: number) => {
    const userPrompt = cards[i].content;
    sendMessage(userPrompt);
  };

  return (
    <div className="flex justify-center items-center h-full flex-col gap-4">
      <Note className="w-auto" />
      <div className="flex justify-center items-center w-[280px] flex-col gap-2">
        <Card
          className="bg-primary/20 shadow-[#FFAB00] hover:bg-primary/10 cursor-pointer w-64 h-24 flex justify-center items-center p-2"
          onClick={() => handleSendMessage(0)}>
          {cards[0].content}
        </Card>
        <div className="flex flex-row gap-2">
          <Card
            className="bg-primary/20 shadow-[#FFAB00] hover:bg-primary/10 cursor-pointer w-32 h-24 flex justify-center items-center p-2"
            onClick={() => handleSendMessage(1)}>
            {cards[1].content}
          </Card>
          <Card
            className="bg-primary/20 shadow-[#FFAB00] hover:bg-primary/10 cursor-pointer w-32 h-24 flex justify-center items-center p-2"
            onClick={() => handleSendMessage(2)}>
            {cards[2].content}
          </Card>
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
