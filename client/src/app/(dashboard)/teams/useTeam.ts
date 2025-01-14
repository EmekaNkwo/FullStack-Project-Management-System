import { useGetTeamsQuery } from "@/state/api";

const useTeam = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();

  return { teams, isLoading, isError };
};

export default useTeam;
