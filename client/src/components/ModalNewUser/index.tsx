import Modal from "@/components/Modal";
import React, { useEffect } from "react";

import { notify, SelectInput, TextInput } from "@/shared";
import useUser from "./useUser";
import { StaffRole } from "@/shared/models";
import { enqueueSnackbar } from "notistack";
import useTeam from "@/app/(dashboard)/teams/useTeam";
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewUser = ({ isOpen, onClose }: Props) => {
  const { isSuccess, handleCreateUser, user, setUser, isFormValid, isLoading } =
    useUser();

  const { teams } = useTeam();

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form
        className="grid grid-cols-1 gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateUser();
        }}
      >
        <div className="flex items-center space-x-4">
          {user.profilePictureUrl ? (
            <img
              src={
                typeof user.profilePictureUrl === "string"
                  ? user.profilePictureUrl
                  : URL.createObjectURL(user.profilePictureUrl as File)
              }
              alt={user.username}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200 text-gray-500">
              No Image
            </div>
          )}
          <div className="flex flex-col">
            <label
              htmlFor="profilePicture"
              className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              Choose Profile Picture
            </label>
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // Check file size (2MB = 2 * 1024 * 1024 bytes)
                  if (file.size > 2 * 1024 * 1024) {
                    notify(enqueueSnackbar, "File size must be less than 2MB", {
                      variant: "error",
                    });
                    return;
                  }
                  setUser({
                    ...user,
                    profilePictureUrl: file,
                  });
                }
              }}
            />
            {user.profilePictureUrl && (
              <button
                type="button"
                className="mt-2 text-sm text-red-500"
                onClick={() => setUser({ ...user, profilePictureUrl: "" })}
              >
                Remove Picture
              </button>
            )}
          </div>
        </div>
        <div />
        <TextInput
          title="First Name"
          value={user.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        />
        <TextInput
          title="Last Name"
          value={user.lastName}
          onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        />
        <TextInput
          title="Username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
        <TextInput
          title="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <SelectInput
          title="Select Role"
          value={user.role}
          onChange={(e) =>
            setUser({ ...user, role: e.target.value as StaffRole })
          }
        >
          <option value={StaffRole.STAFF}>{StaffRole.STAFF}</option>
          <option value={StaffRole.PRODUCT_OWNER}>
            {StaffRole.PRODUCT_OWNER}
          </option>
          <option value={StaffRole.PROJECT_MANAGER}>
            {StaffRole.PROJECT_MANAGER}
          </option>
          <option value={StaffRole.ADMIN}>{StaffRole.ADMIN}</option>
        </SelectInput>
        <SelectInput
          title="Select Team"
          value={user.teamId}
          onChange={(e) => setUser({ ...user, teamId: e.target.value })}
        >
          <option value="">Select team</option>
          {teams?.map((team) => (
            <option key={team.id} value={team.id}>
              {team.teamName}
            </option>
          ))}
        </SelectInput>
        <div />
        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create User"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewUser;
