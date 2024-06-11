import { Metadata } from "next";
import { SidebarView } from "./_components/SidebarView";

export const metadata: Metadata = {
  title: "Ask Ripeseed | ripeseed.io",
  description: "Ask Ripeseed - Ask question about RipeSeed from a bot - A prouct of ripeseed.io",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-[calc(100vh-57px-24px)] flex-col items-center md:h-[calc(100vh-73px-24px)]">
      <div className="h-[calc(100vh-57px-24px)] w-full md:h-[calc(100vh-73px-24px)]">
        <div className="grid h-[calc(100vh-57px-24px)] md:h-[calc(100vh-73px-32px)] md:grid-cols-[280px_1fr]">
          <SidebarView />
          {children}
        </div>
      </div>
    </main>
  );
}
