import { Metadata } from "next";
import SidebarView from "./_components/SidebarView";

export const metadata: Metadata = {
  title: "Chatbot showcase | RipeSeed",
  description: "Ask Ripeseed - A product of ripeseed.io - Transforming ideas into innovative software solutions",
  keywords: [
    "ChatGPT",
    "Artificial Intelignece",
    "Next.js",
    "React",
    "JavaScript",
    "Web Development",
    "App Development",
    "RipeSeed",
  ],

  openGraph: {
    title: "Chatbot showcase | RipeSeed",
    description: "Transforming ideas into innovative software solutions",
    url: "https://ask.ripeseed.io",
    siteName: "RipeSeed",
    locale: "en_US",
    type: "website",
  },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col items-center ">
      <div className=" w-full ">
        <div className="grid h-screen md:grid-cols-[280px_1fr]">
          <SidebarView />
          {children}
        </div>
      </div>
    </main>
  );
};

export default Layout;
