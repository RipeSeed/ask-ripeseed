import { Metadata } from "next";
import SidebarView from "./_components/SidebarView";
import { ChatList } from "./_components/ChatList";
export const metadata: Metadata = {
  title: "Chatbot showcase | RipeSeed",
  description:
    "Ask Ripeseed - A product of ripeseed.io - Transforming ideas into innovative software solutions",
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
    // removed h-screen
    <div className="flex h-[calc[100svh-57px]] flex-col items-center overflow-x-hidden">
      {/* // removed h--full */}
      <div className="flex h-[calc[100svh-57px]] w-full flex-col overflow-x-hidden md:h-[calc[100svh-93px]]">
        {/* // remmoved sidebar view  and export the component inside it here*/}
        {children}
      </div>
    </div>
  );
};

export default Layout;
