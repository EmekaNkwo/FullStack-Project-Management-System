import { useState, useEffect } from "react";
import supabase from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export const useGetUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch user"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  return { user, loading, error };
};
