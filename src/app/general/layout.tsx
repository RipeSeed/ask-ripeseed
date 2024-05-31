import { Metadata } from "next";
import SidebarView from "./_components/SidebarView";

export const metadata: Metadata = {
  title: "Ask Ripeseed",
  description: "Ask Ripeseed - A prouct of ripeseed.io",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col items-center h-[calc(100vh-57px-24px)] md:h-[calc(100vh-73px-24px)]">
      <div className="w-full h-[calc(100vh-57px-24px)] md:h-[calc(100vh-73px-24px)]">
        <div className="grid md:grid-cols-[280px_1fr] h-[calc(100vh-57px-24px)] md:h-[calc(100vh-73px-32px)]">
          <SidebarView />
          {children}
        </div>
      </div>
    </main>
  );
};

export default Layout;
