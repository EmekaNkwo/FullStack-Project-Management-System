import Modal from "@/components/Modal";
import {
  useCreateTaskMutation,
  useGetProjectsQuery,
  useGetUsersQuery,
} from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";
import {
  DateInput,
  notify,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "@/shared";
import { useAppSelector } from "@/app/redux";
import { useSnackbar } from "notistack";
import { Priority, Status } from "@/shared/models";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const currentUserId = useAppSelector(
    (state) => state.global.currentUser?.userId,
  );
  const { enqueueSnackbar } = useSnackbar(); // MUI Snackbar hook

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const validations = {
    title: () =>
      title && title.trim().length >= 3 && title.trim().length <= 100,
    user: () => currentUserId,
    description: () => description && description.trim().length >= 3,
    project: () => id !== null || (projectId && projectId !== ""),
    assignedUser: () => assignedUserId && assignedUserId !== "",
    startDate: () => startDate && startDate !== "",
    dueDate: () => dueDate && dueDate !== "",
  };

  const isFormValid = () => {
    const validations = {
      title: () =>
        title && title.trim().length >= 3 && title.trim().length <= 100,
      user: () => currentUserId,
      project: () => id !== null || (projectId && projectId !== ""),
      assignedUser: () => assignedUserId && assignedUserId !== "",
      // Add more specific validations as needed
    };

    // Validate all conditions
    return Object.values(validations).every((validate) => validate());
  };

  const { data: users, isLoading: userLoading } = useGetUsersQuery();
  const { data: projects, isLoading: projectsLoading } = useGetProjectsQuery();

  const getValidationErrors = () => {
    const errors: string[] = [];

    if (!validations.title()) {
      errors.push("Title must be between 3 and 100 characters");
    }

    if (!validations.description()) {
      errors.push("Description must be at least 3 characters");
    }

    if (!validations.user()) {
      errors.push("User authentication is required");
    }

    if (!validations.project()) {
      errors.push("Please select a project");
    }

    if (!validations.assignedUser()) {
      errors.push("Please assign a user to the task");
    }

    return errors;
  };

  const getFieldError = (field: keyof typeof validations) => {
    return !validations[field]() ? `Invalid ${field}` : "";
  };

  const handleSubmit = async () => {
    if (!title || !currentUserId || !(id !== null || projectId)) return;

    const errors = getValidationErrors();

    if (errors.length > 0) {
      setValidationErrors(errors);
      notify(enqueueSnackbar, "Please fix form errors", { variant: "error" });
      return;
    }

    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });

    try {
      await createTask({
        title,
        description,
        status,
        priority,
        tags,
        startDate: formattedStartDate,
        dueDate: formattedDueDate,
        authorUserId: currentUserId,
        assignedUserId: parseInt(assignedUserId),
        projectId: id !== null ? Number(id) : Number(projectId),
      });
      notify(enqueueSnackbar, "Task created successfully!", {
        variant: "success",
      });
      onClose();
    } catch (error: any) {
      notify(enqueueSnackbar, `${error ? error : "Failed to create task!"}`, {
        variant: "error",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      {validationErrors.length > 0 && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {validationErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextInput
          title="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={getFieldError("title")}
        />
        <TextAreaInput
          title="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={getFieldError("description")}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <SelectInput
            title="Status"
            value={status}
            onChange={(e) =>
              setStatus(Status[e.target.value as keyof typeof Status])
            }
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </SelectInput>

          <SelectInput
            title="Priority"
            value={priority}
            onChange={(e) =>
              setPriority(Priority[e.target.value as keyof typeof Priority])
            }
          >
            <option value="">Select Priority</option>
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </SelectInput>
        </div>

        <TextInput
          title="Add Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <DateInput
            title="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            error={getFieldError("startDate")}
          />
          <DateInput
            title="Due Date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={getFieldError("dueDate")}
          />
        </div>

        <SelectInput
          title="Assigned User ID"
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
          error={getFieldError("assignedUser")}
        >
          {userLoading ? (
            <option>Loading...</option>
          ) : (
            <>
              <option value="">Select User</option>
              {users?.map((user) => (
                <option key={user?.userId} value={user?.userId}>
                  {user?.username}
                </option>
              ))}
            </>
          )}
        </SelectInput>

        {id === null && (
          <>
            <SelectInput
              title="Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              {projectsLoading ? (
                <option>Loading...</option>
              ) : (
                <>
                  <option value="">Select Project</option>
                  {projects?.map((project) => (
                    <option key={project?.id} value={project?.id}>
                      {project?.name}
                    </option>
                  ))}
                </>
              )}
            </SelectInput>
          </>
        )}
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
