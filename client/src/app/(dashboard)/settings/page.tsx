"use client";
import Header from "@/components/Header";
import useSidebar from "@/components/Sidebar/useSidebar";
import { notify } from "@/shared";
import { useGetTeamQuery } from "@/state/api";
import { enqueueSnackbar } from "notistack";
import React, { useEffect } from "react";

const Settings = () => {
  const { currentUser } = useSidebar();

  const {
    data: team,
    isLoading,
    isError,
    error,
  } = useGetTeamQuery(String(currentUser?.teamId), {
    skip: !currentUser?.teamId,
  });

  useEffect(() => {
    if (isError) {
      notify(
        enqueueSnackbar,
        `${error ? (error instanceof Error ? error.message : "Failed to fetch team!") : "Failed to fetch team!"}`,
        {
          variant: "error",
        },
      );
    }
  }, [isError, error]);

  const userSettings = {
    username: currentUser?.username,
    email: currentUser?.email,
    teamName: isLoading
      ? "loading..."
      : currentUser?.teamId === null
        ? "No team"
        : team?.teamName,
    roleName: currentUser?.role,
  };

  const labelStyles = "block text-sm font-medium dark:text-white";
  const textStyles =
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white";

  return (
    <div className="p-8">
      <Header name="Settings" />
      <div className="space-y-4">
        <div>
          <label className={labelStyles}>Username</label>
          <div className={textStyles}>{userSettings.username}</div>
        </div>
        <div>
          <label className={labelStyles}>Email</label>
          <div className={textStyles}>{userSettings.email}</div>
        </div>
        <div>
          <label className={labelStyles}>Team</label>
          <div className={textStyles}>{userSettings.teamName}</div>
        </div>
        <div>
          <label className={labelStyles}>Role</label>
          <div className={textStyles}>{userSettings.roleName}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
