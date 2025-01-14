import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { notify } from "@/shared";
import { Task } from "@/shared/models";
import { useGetTasksQuery } from "@/state/api";
import { enqueueSnackbar } from "notistack";
import React from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isError,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isError) {
    const errorMessage = error
      ? error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: string }).data || "Unknown error"
          : "Error fetching tasks"
      : "Error fetching tasks";

    notify(enqueueSnackbar, errorMessage, { variant: "error" });

    return null;
  }
  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <button
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          tasks?.map((task: Task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
};

export default ListView;
