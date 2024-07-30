import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask RipeSeed | RipeSeed",
  description: "Ask question about RipeSeed from a bot",
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
    title: "Ask RipeSeed | RipeSeed",
    description: "Ask question about RipeSeed from a bot",
    url: "https://ask.ripeseed.io/ask-ripeseed",
    siteName: "RipeSeed",
    locale: "en_US",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="] flex-col items-center">
      <div className="w-full">{children}</div>
    </main>
  );
}
