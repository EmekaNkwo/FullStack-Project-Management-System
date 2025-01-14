import type { Metadata } from "next";
import { Karla } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";

const karla = Karla({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fullstack Project Management",
  description: "Manage projects and tasks with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={karla.className}>
        <DashboardWrapper>{children}</DashboardWrapper>
      </body>
    </html>
  );
}
