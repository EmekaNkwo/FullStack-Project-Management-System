import Modal from "@/components/Modal";
import { useCreateProjectMutation, useCreateTeamMutation } from "@/state/api";
import React, { useEffect, useState } from "react";
import { formatISO } from "date-fns";
import {
  DateInput,
  notify,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "@/shared";
import { useSnackbar } from "notistack";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewTeam = ({ isOpen, onClose }: Props) => {
  const [createTeam, { isLoading, isSuccess, isError, error }] =
    useCreateTeamMutation();
  const [teamName, setTeamName] = useState("");
  const [productOwner, setProductOwner] = useState(0);
  const [productManager, setProductManager] = useState(0);

  const { enqueueSnackbar } = useSnackbar(); // MUI Snackbar hook

  useEffect(() => {
    if (isSuccess) {
      notify(enqueueSnackbar, "Team created successfully!");
      onClose();
    } else if (isError) {
      notify(enqueueSnackbar, `${error ? error : "Failed to create team!"}`, {
        variant: "error",
      });
    }
  }, [isSuccess, isError]);

  const handleSubmit = async () => {
    if (!teamName) return;

    await createTeam({
      teamName,
      productOwnerUserId: productOwner === 0 ? undefined : productOwner,
      projectManagerUserId: productManager === 0 ? undefined : productManager,
    });
  };

  const isFormValid = () => {
    return teamName;
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
          title="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <SelectInput
          title="Product Owner"
          value={productOwner}
          onChange={(e) => setProductOwner(Number(e.target.value))}
        >
          <option value={undefined}>Select Product Owner</option>
        </SelectInput>
        <SelectInput
          title="Project Manager"
          value={productManager}
          onChange={(e) => setProductManager(Number(e.target.value))}
        >
          <option value={undefined}>Select Project Manager</option>
        </SelectInput>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTeam;
