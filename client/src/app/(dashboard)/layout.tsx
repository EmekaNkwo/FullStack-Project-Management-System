"use client";
import React from "react";
import { useAppSelector } from "../redux";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useGetMeQuery } from "@/state/api";

import { useRouter } from "next/navigation";
import { Loader } from "@/shared";
import { storageFactory } from "@/lib/utils";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { isLoading, isError } = useGetMeQuery();

  const token = storageFactory().getItem("product_accessToken");
  useEffect(() => {
    if (isError && !token) {
      router.push("/auth");
    }
  }, [router, isError, token]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50">
        <Loader />
        <div className="ml-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      <Sidebar />
      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default Layout;
