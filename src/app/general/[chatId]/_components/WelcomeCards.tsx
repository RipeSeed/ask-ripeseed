import { store } from "@/app/_utils/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { BookOpenCheck } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import clock from '../../../../../public/clock.png'
import config from '../../../../../public/config.png'

export interface Cardset {
  top: string;
  bottomLeft: string;
  bottomRight: string;
}

interface Props {
  sendMessage: (newMessage: string) => Promise<boolean>;
  cards: Cardset;
  hideSetupKey?: boolean;
}

export const WelcomeCards = ({
  sendMessage,
  cards,
  hideSetupKey = false,
}: Props) => {
  const { set, useSnapshot } = store;
  const { openAIKey } = useSnapshot();
  const [key, setKey] = useState<string>("");

  useEffect(() => {
    set("openAIKey", localStorage.getItem("openai:key") ?? "");
    setKey(openAIKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAIKey]);

  return (
    <div className="flex h-full flex-col  items-center justify-center gap-4 px-4">
      <div className="flex max-w-[500px] flex-col gap-4 md:w-[500px]">
        {!hideSetupKey && !key.length ? (
          <Note className="w-full cursor-pointer" />
        ) : null}
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <Card
            className="flex h-24 w-full cursor-pointer items-center justify-center border-0 dark:bg-[#404043] bg-white  dark:text-darkText p-2 text-lightText shadow-none "
            onClick={() => sendMessage(cards.top)}
          >
            <div className="">
            <Image src={clock} alt="clock" className="block m-auto my-2" />
            {cards.top}
            </div>
          </Card>
          <div className="flex w-full flex-row gap-2">
            <Card
              className="flex h-24 w-full cursor-pointer items-center justify-center border-0  dark:bg-[#404043] bg-white  dark:text-darkText  p-2 text-lightText shadow-none "
              onClick={() => sendMessage(cards.bottomLeft)}
            >
               <div>
            <Image src={clock} alt="clock" className="block m-auto my-2" />
            {cards.bottomLeft}
            </div>
            </Card>
            <Card
              className="flex h-24 w-full cursor-pointer items-center justify-center border-0 dark:bg-[#404043] bg-white  dark:text-darkText p-2 text-lightText shadow-none "
              onClick={() => sendMessage(cards.bottomRight)}
            >
               <div>
            <Image src={clock} alt="clock" className="block m-auto my-2" />
            {cards.bottomRight}
            </div>
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
    <Alert variant="info" className={`${className} bg-[#D4E1DE] dark:bg-[#334040] border-[#1B9E84] text-white`} onClick={handleOpenConfig}>
      <AlertDescription className="flex items-center flex-row gap-2 ">
        <Image alt="config" src={config} className="h-3 w-3" />
        <span className="text-[#1B9E84]">        Configure your OpenAI Key from gear icon at top-right to continue.
</span>
      </AlertDescription>
    </Alert>
  );
};
