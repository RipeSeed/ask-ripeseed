import { Inter } from "next/font/google";
import DashboardSideBar from "./_components/DashboardSideBar/DashboardSideBar";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="flex w-screen h-screen">
                    <DashboardSideBar />
                    <div className="flex-[8]">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    );
}