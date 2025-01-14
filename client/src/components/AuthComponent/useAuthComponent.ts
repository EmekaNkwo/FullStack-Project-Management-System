"use client";
import { useAppDispatch } from "@/app/redux";
import supabase from "@/lib/supabase";
import { generateNumericUUID, storageFactory } from "@/lib/utils";
import { notify } from "@/shared";
import { setAccessToken, setCurrentUser } from "@/state";
import { useLoginMutation, useRegisterMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

interface AuthState {
  email: string;
  fullName?: string;
  password: string;
  confirmPassword?: string;
  showPassword: boolean;
  showConfirmPassword?: boolean;
  error: string;
  loading: boolean;
}

interface ErrorMesg {
  message: string;
}

const useAuthComponent = () => {
  const [authState, setAuthState] = useState<AuthState>({
    email: "",
    password: "",
    fullName: "",
    confirmPassword: "",
    showPassword: false,
    error: "",
    loading: false,
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [
    login,
    {
      isLoading: isLoginLoading,
      data: loginData,
      isSuccess: isLoginSuccess,
      isError: isLoginError,
      error: loginError,
    },
  ] = useLoginMutation();
  const [
    register,
    {
      isLoading: isRegisterLoading,
      data: registerData,
      isSuccess: isRegisterSuccess,
      isError: isRegisterError,
      error: registerError,
    },
  ] = useRegisterMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState({
      ...authState,
      error: "",
      loading: true,
    });

    try {
      await login({ email: authState.email, password: authState.password });
    } catch (err) {
      setAuthState({
        ...authState,
        error: err instanceof Error ? err.message : "Login failed",
        loading: false,
      });
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthState({
      ...authState,
      error: "",
      loading: true,
    });

    try {
      await register({
        email: authState.email,
        password: authState.password,
        fullName: authState.fullName,
      });
    } catch (err) {
      setAuthState({
        ...authState,
        error: err instanceof Error ? err.message : "Login failed",
        loading: false,
      });
    }
  };

  useEffect(() => {
    const isError = isLoginError || isRegisterError;
    const errorMessage = loginError || registerError;
    const isSuccess = isLoginSuccess || isRegisterSuccess;

    if (isSuccess) {
      notify(
        enqueueSnackbar,
        isLoginSuccess ? "Login successful" : "Registration successful",
        {
          variant: "success",
        },
      );
      storageFactory().setItem("product_accessToken", loginData?.token ?? "");
      dispatch(setCurrentUser((loginData?.user || registerData?.user) ?? null));
      router.push("/home");
    } else if (isError) {
      notify(
        enqueueSnackbar,
        `${errorMessage ? (errorMessage as ErrorMesg)?.message : "Something went wrong"}`,
        {
          variant: "error",
        },
      );
    }
  }, [
    isLoginError,
    isRegisterError,
    loginError,
    registerError,
    isLoginSuccess,
    isRegisterSuccess,
  ]);

  const handleClickShowPassword = (value: string) => {
    setAuthState({
      ...authState,
      [value]: !authState[value as keyof AuthState],
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  return {
    authState,
    setAuthState,
    handleClickShowPassword,
    handleLogin,
    handleMouseDownPassword,
    handleCreateUser,
    isRegisterLoading,
    isLoginLoading,
  };
};

export default useAuthComponent;
