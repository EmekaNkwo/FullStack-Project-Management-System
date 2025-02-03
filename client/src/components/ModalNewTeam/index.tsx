import Modal from "@/components/Modal";
import { useCreateTeamMutation, useGetUsersQuery } from "@/state/api";
import React, { useEffect, useState } from "react";
import { notify, SelectInput, TextInput } from "@/shared";
import { useSnackbar } from "notistack";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewTeam = ({ isOpen, onClose }: Props) => {
  const [createTeam, { isLoading, isSuccess, isError, error }] =
    useCreateTeamMutation();
  const initialData = {
    teamName: "",
    productOwner: 0,
    productManager: 0,
  };
  const [teamData, setTeamData] = useState(initialData);

  const {
    data: users,
    isLoading: usersLoading,
    isError: usersIsError,
  } = useGetUsersQuery();

  const projectManagers = users?.filter(
    (user) => user.role === "PROJECT_MANAGER",
  );
  const productOwners = users?.filter((user) => user.role === "PRODUCT_OWNER");

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
    if (!teamData.teamName) return;

    await createTeam({
      teamName: teamData.teamName,
      productOwnerUserId:
        teamData.productOwner === 0 ? undefined : teamData.productOwner,
      projectManagerUserId:
        teamData.productManager === 0 ? undefined : teamData.productManager,
    });
  };

  const isFormValid = () => {
    return teamData.teamName;
  };

  useEffect(() => {
    if (isSuccess) {
      setTeamData(initialData);
      onClose();
    }
  }, [isSuccess]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Team">
      <form
        className="mt-4 flex flex-col space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextInput
          title="Team Name"
          value={teamData.teamName}
          onChange={(e) =>
            setTeamData({ ...teamData, teamName: e.target.value })
          }
        />
        <SelectInput
          title="Product Owner"
          value={teamData.productOwner}
          onChange={(e) =>
            setTeamData({ ...teamData, productOwner: Number(e.target.value) })
          }
        >
          <option value={undefined}>Select Product Owner</option>
          {productOwners?.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.fullName}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          title="Project Manager"
          value={teamData.productManager}
          onChange={(e) =>
            setTeamData({ ...teamData, productManager: Number(e.target.value) })
          }
        >
          <option value={undefined}>Select Project Manager</option>
          {projectManagers?.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.fullName}
            </option>
          ))}
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
