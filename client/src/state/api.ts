import supabase from "@/lib/supabase";
import { storageFactory } from "@/lib/utils";
import { Project, SearchResults, Task, Team, User } from "@/shared/models";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const access_token = storageFactory().getItem("product_accessToken");
      if (access_token) {
        headers.set("Authorization", `Bearer ${access_token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Teams", "User", "AuthUser", "Team"],
  endpoints: (build) => ({
    login: build.mutation({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),
    register: build.mutation({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
    }),
    getMe: build.query<User, void>({
      query: () => "auth/me",
      providesTags: ["AuthUser"],
    }),
    getAuthUser: build.query({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (!userData) throw new Error("No user found");
          const { user } = userData;

          const userDetailsResponse = await fetchWithBQ(
            `users/${user?.user_metadata?.userId}`,
          );
          const userDetails = userDetailsResponse.data as User;

          return { data: { user, userSub: user?.id, userDetails } };
        } catch (error: any) {
          return { error: error.message || "Could not fetch user data" };
        }
      },
    }),
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),
    getUser: build.query<User[], number | string>({
      query: (userId) => `users/${userId}`,
      providesTags: ["User"],
    }),
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: ["Tasks"],
    }),
    getTasksByUser: build.query<Task[], number | string>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),

    createUser: build.mutation<User, FormData>({
      query: (formData) => ({
        url: "users",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Users"],
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    getTeam: build.query<Team, number | string>({
      query: (teamId) => `teams/${teamId}`,
      providesTags: ["Team"],
    }),
    createTeam: build.mutation<Team, Partial<Team>>({
      query: (team) => ({
        url: "teams",
        method: "POST",
        body: team,
      }),
      invalidatesTags: ["Teams"],
    }),
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
  useGetTasksByUserQuery,
  useGetAuthUserQuery,
  useCreateUserMutation,
  useCreateTeamMutation,
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetTeamQuery,
} = api;
