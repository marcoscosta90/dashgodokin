import { GetServerSidePropsContext } from "next";

import { useQuery, UseQueryOptions } from "react-query";

import { api } from "../api";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface GetUsersResponseProps {
  users: User[];
  totalCount: number;
}

export async function getUsers(
  page: number,
  ctx: GetServerSidePropsContext = undefined
): Promise<GetUsersResponseProps> {
  const { data, headers } = await api.get("users", {
    params: {
      page,
    },
  });

  const users: User[] = data.users.map((user: User) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: new Date(user.created_at).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
  });

  const totalCount = Number(headers["x-total-count"]);

  return {
    users,
    totalCount,
  };
}

export function useUsers(
  page: number,
  options?: UseQueryOptions<GetUsersResponseProps>
) {
  return useQuery(["users", page], () => getUsers(page), {
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
}
