import SidebarView from "./_components/SidebarView";
import { Chat } from "./_components/chat/Chat";

export default function Home() {
  return (
    <main className="flex flex-col items-center h-[calc(100vh-57px)] md:h-[calc(100vh-73px)]">
      <div className="w-full h-[calc(100vh-57px)] md:h-[calc(100vh-73px)]">
        <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] h-[calc(100vh-57px)] md:h-[calc(100vh-73px)]">
          <SidebarView />
          <Chat />
        </div>
      </div>
    </main>
  );
}
