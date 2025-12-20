import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import useAxiosSecure from "./useAxiosSecure";
import { AuthContext } from "../Authentication/AuthContext";


/**
 * useUserRole({ referralCode, email, enabled })
 * - If referralCode is provided, it takes priority.
 * - Else uses email arg, else falls back to AuthContext user.email.
 */
const useUserRole = (args = {}) => {
  const { email: emailArg = null, referralCode = null, enabled } = args;
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // Decide which identifier to use
  const identifier = useMemo(() => {
    if (referralCode && referralCode.trim()) {
      return { kind: "referralCode", value: referralCode.trim() };
    }
    const email = (emailArg ?? user?.email ?? "").toString().trim().toLowerCase();
    if (email) return { kind: "email", value: email };
    return null;
  }, [referralCode, emailArg, user?.email]);

  const isEnabled = !authLoading && Boolean(identifier) && (enabled ?? true);

  const {
    data: role = "user",
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userRole", identifier?.kind ?? "none", identifier?.value ?? "none"],
    enabled: isEnabled,
    retry: 1, // If request fails, treat as non-admin on next render
    queryFn: async () => {
      if (!identifier) return "user";

      // Build params safely (lets axios handle encoding)
      const params =
        identifier.kind === "referralCode"
          ? { referralCode: identifier.value.toUpperCase() }
          : { email: identifier.value };

      const res = await axiosSecure.get("/users/role", { params });
      return res.data?.role || "user";
    },
  });

  return {
    role,
    roleLoading: authLoading || isLoading,
    error,
    refetch,
  };
};

export default useUserRole;
