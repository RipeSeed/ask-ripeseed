import { Metadata } from "next";
import SidebarView from "./_components/SidebarView";
import { Chat } from "./_components/chat/Chat";

export const metadata: Metadata = {
  title: "Ask Ripeseed",
  description: "Ask Ripeseed - A prouct of ripeseed.io",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function Home() {
  return (
    <main className="flex flex-col items-center h-[calc(100vh-57px-24px)] md:h-[calc(100vh-73px-24px)]">
      <div className="w-full h-[calc(100vh-57px-24px)] md:h-[calc(100vh-73px-24px)]">
        <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] h-[calc(100vh-57px-24px)] md:h-[calc(100vh-73px-32px)]">
          <SidebarView />
          <Chat />
        </div>
      </div>
    </main>
  );
}
