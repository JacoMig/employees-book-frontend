import { UserCard } from "@/components/UserCard";
import { useAuth } from "@/context/Auth";
import httpUserClient from "@/http/user";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export const HelloWorld = () => {
  const { user: currentUser } = useAuth();

  const { list } = httpUserClient();

  const { data: users, refetch: refetchUsers } = useQuery({
    queryKey: ["listUsers"],
    queryFn: async () => await list(),
    refetchOnWindowFocus: false,
    staleTime: (60 * 5) * 1000
  });

  return (
    <>
      <h1>Hello {currentUser?.username}!</h1>
      <div className="grid grid-cols-4 gap-4">
        {users?.map((u) => {
          return (
            <UserCard key={u?.id} deleteUserCallback={refetchUsers} user={u} />
          );
        })}
      </div>
    </>
  );
};

export default HelloWorld;
