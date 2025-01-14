import Modal from "@/components/Modal";
import { useCreateProjectMutation } from "@/state/api";
import React, { useEffect, useState } from "react";
import { formatISO } from "date-fns";
import { DateInput, notify, TextAreaInput, TextInput } from "@/shared";
import { useSnackbar } from "notistack";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const [createProject, { isLoading, isSuccess, isError, error }] =
    useCreateProjectMutation();
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { enqueueSnackbar } = useSnackbar(); // MUI Snackbar hook

  useEffect(() => {
    if (isSuccess) {
      notify(enqueueSnackbar, "Board created successfully!");
      onClose();
    } else if (isError) {
      notify(enqueueSnackbar, `${error ? error : "Failed to create board!"}`, {
        variant: "error",
      });
    }
  }, [isSuccess, isError]);

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) return;

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedEndDate = formatISO(new Date(endDate), {
      representation: "complete",
    });

    await createProject({
      name: projectName,
      description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  };

  const isFormValid = () => {
    return projectName && description && startDate && endDate;
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="mt-4 flex flex-col space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextInput
          title="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <TextAreaInput
          title="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <DateInput
            title="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DateInput
            title="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewProject;
