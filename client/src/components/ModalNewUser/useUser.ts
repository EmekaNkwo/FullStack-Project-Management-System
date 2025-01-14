import { notify } from "@/shared";
import { StaffRole } from "@/shared/models";
import { useCreateUserMutation } from "@/state/api";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

interface IUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  teamId: string;
  profilePictureUrl: string | File;
}
const useUser = () => {
  const initialState: IUser = {
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    role: StaffRole.STAFF,
    teamId: "",
    profilePictureUrl: "",
  };

  const [user, setUser] = useState<IUser>(initialState);
  const [createUser, { isLoading, isSuccess, isError, error }] =
    useCreateUserMutation();

  const { enqueueSnackbar } = useSnackbar();

  const handleCreateUser = async () => {
    if (!user.username || !user.email || !user.firstName || !user.lastName)
      return;

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    if (user.profilePictureUrl instanceof File) {
      formData.append("profilePicture", user.profilePictureUrl);
    }
    formData.append("fullName", `${user.firstName} ${user.lastName}`);
    formData.append("teamId", user.teamId.toString());
    formData.append("role", user.role);

    await createUser(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      notify(enqueueSnackbar, "User created successfully!");
    } else if (isError) {
      if (error instanceof Error) {
        notify(
          enqueueSnackbar,
          `${error?.message || "Failed to create user!"}`,
          {
            variant: "error",
          },
        );
      }
    }
  }, [isSuccess, isError, enqueueSnackbar]);
  const isFormValid = () => {
    return (
      user.username &&
      user.email &&
      user.firstName &&
      user.lastName &&
      user.teamId
    );
  };

  return {
    user,
    setUser,
    handleCreateUser,
    isFormValid,
    isLoading,
    isSuccess,
  };
};

export default useUser;
