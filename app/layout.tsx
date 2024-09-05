import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./css/globals.scss";
import Sidebar from "./components/sidebar/Sidbar";
import Main from "./components/main/Main";
import Header from "./components/header/Header";
import { headers } from "next/headers";
import AppTopHeader from "./components/appTop/AppTopHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Manage Staff",
  description: "シンプルで使いやすいインターフェースを備えたManageStaffは、直感的な操作で誰でも簡単にプロジェクトとタスクを管理できます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers()
  const tenantId = headersList.get('X-Tenant-Id')
  return (
    <html lang="ja">
      <head>
        <link rel="icon" sizes="32x32" href="/icon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"></link>
      </head>
      <body className={inter.className}>
        {tenantId && (
          <>
            <Sidebar />
            <Main>
              <Header />
              {children}
            </Main>
          </>
        )}
        {!tenantId && (
          <>
            <AppTopHeader />
            {children}
          </>
        )}
      </body>
    </html>
  );
}
