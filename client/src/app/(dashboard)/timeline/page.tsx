"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";
import ModalNewProject from "../projects/ModalNewProject";
import { SelectInput } from "@/shared";

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      projects?.map((project) => ({
        start: new Date(project?.startDate as string),
        end: new Date(project?.endDate as string),
        name: project?.name,
        id: `Project-${project?.id}`,
        type: "project" as TaskTypeItems,
        progress: 50,
        isDisabled: false,
      })) || []
    );
  }, [projects]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isError)
    return (
      <div className="py-4 text-center">
        An error occurred while fetching projects
      </div>
    );

  return (
    <div className="max-w-full p-8">
      <ModalNewProject
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <header className="mb-4 flex items-center justify-between">
        <Header
          name="Projects Timeline"
          buttonComponent={
            <div className="flex items-center">
              <button
                className="mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                onClick={() => setIsModalOpen(true)}
              >
                Add Project
              </button>
              <div className="relative inline-block w-64">
                <SelectInput
                  value={displayOptions.viewMode}
                  onChange={handleViewModeChange}
                >
                  <option value={ViewMode.Day}>Day</option>
                  <option value={ViewMode.Week}>Week</option>
                  <option value={ViewMode.Month}>Month</option>
                </SelectInput>
              </div>
            </div>
          }
        />
      </header>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          {isLoading ? (
            <div className="py-4 text-center">Loading...</div>
          ) : projects?.length === 0 ? (
            <div className="p-4 text-center">No projects found</div>
          ) : (
            <Gantt
              tasks={ganttTasks}
              {...displayOptions}
              columnWidth={
                displayOptions.viewMode === ViewMode.Month ? 150 : 100
              }
              listCellWidth="100px"
              projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
              projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
              projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
