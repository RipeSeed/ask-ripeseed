import { store } from "@/app/_utils/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
const clock = "/clock.png";
const config = "/config.png";

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
  const messageHandler = (message: string) => {
    if (!key) {
      handleOpenConfig();
    } else {
      sendMessage(message);
    }
  };
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 px-4 py-3">
      {/* // div controlls chat cards */}
      <div className="flex w-full flex-col gap-4 md:max-w-[500px]">
        {!hideSetupKey && !key.length ? (
          <Note className="w-full cursor-pointer" />
        ) : null}
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <Card
            className="flex h-24 w-full cursor-pointer items-center justify-center border-0 bg-white p-2 text-lightText shadow-none dark:bg-[#404043] dark:text-darkText"
            onClick={() => messageHandler(cards.top)}
          >
            <div className="">
              <Image
                src={clock}
                alt="clock"
                width={22}
                height={22}
                className="m-auto my-2 block"
              />
              {cards.top}
            </div>
          </Card>

          <div className="flex w-full flex-row gap-2">
            <Card
              className="flex h-24 w-full cursor-pointer items-center justify-center border-0 bg-white p-2 text-lightText shadow-none dark:bg-[#404043] dark:text-darkText"
              onClick={() => messageHandler(cards.bottomLeft)}
            >
              <div>
                <Image
                  src={clock}
                  alt="clock"
                  width={22}
                  height={22}
                  className="m-auto my-2 block"
                />
                {cards.bottomLeft}
              </div>
            </Card>

            <Card
              className="flex h-24 w-full cursor-pointer items-center justify-center border-0 bg-white p-2 text-lightText shadow-none dark:bg-[#404043] dark:text-darkText"
              onClick={() => messageHandler(cards.bottomRight)}
            >
              <div>
                <Image
                  src={clock}
                  alt="clock"
                  width={22}
                  height={22}
                  className="m-auto my-2 block"
                />
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
  return (
    <Alert
      variant="info"
      className={`${className} border-[#1B9E84] bg-[#D4E1DE] text-white dark:bg-[#334040]`}
      onClick={handleOpenConfig}
    >
      <AlertDescription className="flex flex-row items-center gap-2">
        <Image
          alt="config"
          src={config}
          className="h-3 w-3"
          height={16}
          width={18}
        />
        <span className="text-[#1B9E84]">
          Configure your OpenAI Key from gear icon at top-right to continue.
        </span>
      </AlertDescription>
    </Alert>
  );
};
