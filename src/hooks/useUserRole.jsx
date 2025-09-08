import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import useAxiosSecure from './useAxiosSecure';
import { AuthContext } from '../Authentication/AuthProvider';

const useUserRole = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const {
    data: role = 'user',
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ['userRole', user?.email || null],
    enabled: !authLoading && Boolean(user?.email),
    queryFn: async () => {
      const raw = (user?.email || '').toString();
      const email = encodeURIComponent(raw.trim().toLowerCase());
      // Prefer query variant to avoid any path-encoding edge cases
      const res = await axiosSecure.get(`/users/role?email=${email}`);
      return res.data?.role || 'user';
    },
    // If request fails for any reason, treat as non-admin
    retry: 1,
  });

  return { role, roleLoading: authLoading || roleLoading, refetch };
};

export default useUserRole;
