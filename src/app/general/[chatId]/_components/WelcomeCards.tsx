import { store } from "@/app/_utils/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import clock from "../../../../../public/clock.png";
import config from "../../../../../public/config.png";

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
const { set } = store;
const handleOpenConfig = () => {
  set("isConfigOpen", true);
};
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
    <div className="flex w-full flex-col items-center justify-center gap-4 px-4 py-3">
      {/* // div controlls chat cards */}
      <div className="flex w-full flex-col gap-4 md:max-w-[500px]">
        {!hideSetupKey && !key.length ? (
          <Note className="w-full cursor-pointer" />
        ) : null}
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <Alert variant="info" onClick={handleOpenConfig} className="p-0">
            <AlertDescription>
              <Card
                className="flex h-24 w-full cursor-pointer items-center justify-center border-0 bg-white p-2 text-lightText shadow-none dark:bg-[#404043] dark:text-darkText"
                onClick={() => sendMessage(cards.top)}
              >
                <div className="">
                  <Image
                    src={clock}
                    alt="clock"
                    className="m-auto my-2 block"
                  />
                  {cards.top}
                </div>
              </Card>
            </AlertDescription>
          </Alert>
          <div className="flex w-full flex-row gap-2">
            <Alert variant="info" onClick={handleOpenConfig} className="p-0">
              <AlertDescription>
                <Card
                  className="flex h-24 w-full cursor-pointer items-center justify-center border-0 bg-white p-2 text-lightText shadow-none dark:bg-[#404043] dark:text-darkText"
                  onClick={() => sendMessage(cards.bottomLeft)}
                >
                  <div>
                    <Image
                      src={clock}
                      alt="clock"
                      className="m-auto my-2 block"
                    />
                    {cards.bottomLeft}
                  </div>
                </Card>
              </AlertDescription>
            </Alert>
           <Alert variant="info" onClick={handleOpenConfig} className="p-0">
            <AlertDescription>
            <Card
              className="flex h-24 w-full cursor-pointer items-center justify-center border-0 bg-white p-2 text-lightText shadow-none dark:bg-[#404043] dark:text-darkText"
              onClick={() => sendMessage(cards.bottomRight)}
            >
              <div>
                <Image src={clock} alt="clock" className="m-auto my-2 block" />
                {cards.bottomRight}
              </div>
            </Card>
            </AlertDescription>
           </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

const Note = ({ className }: { className?: string }) => {
  return (
    <Alert
      variant="info"
      className={`${className} border-[#1B9E84] bg-[#D4E1DE] text-white dark:bg-[#334040]`}
      onClick={handleOpenConfig}
    >
      <AlertDescription className="flex flex-row items-center gap-2">
        <Image alt="config" src={config} className="h-3 w-3" />
        <span className="text-[#1B9E84]">
          Configure your OpenAI Key from gear icon at top-right to continue.
        </span>
      </AlertDescription>
    </Alert>
  );
};
