import { store } from "@/app/_utils/store";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { configPaths, isPath } from "../../../../components/common/Header/constants";
import { usePathname } from "next/navigation";
import { addAndSelectChat } from "../utils/creatNewChat";
import { useRouter } from "next/navigation";
const clock = "/clock.png";
const config = "/config.png";

export interface Cardset {
  top: string;
  bottomLeft: string;
  bottomRight: string;
}

interface Props {
  cards: Cardset;
  hideSetupKey?: boolean;
}
const { set } = store;
const handleOpenConfig = () => {
  set("isConfigOpen", true);
};
export const WelcomeCards = ({
  cards,
  hideSetupKey = false,
}: Props) => {
  const { set, useSnapshot } = store;
  let pathname = usePathname();
  pathname = useMemo(() => {
    return pathname.search("ask-anything") === -1 ? "-1" : pathname.split("/")[2] ?? "0";
  }, [pathname]);
  // pathname will always be "-1" or "0" or "{id}" indicating ask-ripeseed or ask-anything or chatId
  const { openAIKey } = useSnapshot();
  const [key, setKey] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    set("openAIKey", localStorage.getItem("openai:key") ?? "");
    setKey(openAIKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAIKey]);
  
  const messageHandler = async (message: string) => {
    if (isPath(configPaths, pathname) && !key) {
      handleOpenConfig();
    } else {
      let chatId = Number(pathname);
      if (chatId === 0) {
        chatId = await addAndSelectChat();
        set("stateMetadata", {
          chatId,
          message,
          indexId: "",
        });
        if (chatId) router.push(`/ask-anything/${chatId}`);
      } else {
        // for ask-ripeseed i.e. chatId = -1
        set("stateMetadata", {
          chatId,
          message,
          indexId: "",
        });
      }
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
            className="flex h-24 w-full cursor-pointer items-center justify-center border border-[#CECECE] bg-[#EFEFEF] p-2 text-lightText shadow-sm dark:border-[#3C3C3F] dark:bg-[#404043] dark:text-darkText"
            onClick={() => messageHandler(cards.top)}
          >
            <div className="text-center">
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
              className="flex h-24 w-full cursor-pointer items-center justify-center border border-[#CECECE] bg-[#EFEFEF] p-2 text-lightText shadow-sm dark:border-[#3C3C3F] dark:bg-[#404043] dark:text-darkText"
              onClick={() => messageHandler(cards.bottomLeft)}
            >
              <div className="text-center">
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
              className="flex h-24 w-full cursor-pointer items-center justify-center border border-[#CECECE] bg-[#EFEFEF] p-2 text-lightText shadow-sm dark:border-[#3C3C3F] dark:bg-[#404043] dark:text-darkText"
              onClick={() => messageHandler(cards.bottomRight)}
            >
              <div className="text-center">
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
