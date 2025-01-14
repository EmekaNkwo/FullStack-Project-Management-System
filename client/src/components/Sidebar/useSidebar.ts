import { useAppSelector } from "@/app/redux";
import { useGetProjectsQuery } from "@/state/api";
import React, { useState } from "react";

const useSidebar = () => {
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();

  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const currentUser = useAppSelector((state) => state.global.currentUser);

  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const handleSignOut = async () => {
    try {
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  return {
    projects,
    isProjectsLoading,
    isSidebarCollapsed,
    currentUser,
    showProjects,
    showPriority,
    setShowProjects,
    setShowPriority,
    handleSignOut,
  };
};

export default useSidebar;
