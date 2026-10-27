import { useQuery } from '@tanstack/react-query';

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async (): Promise<UserDto> => {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
    select: toUser, // stable module-scope reference
  });
}
export {};
