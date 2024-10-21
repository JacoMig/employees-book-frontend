import { UserCard } from "@/components/UserCard";
import { UsersTable } from "@/components/UsersTable";
import { useAuth } from "@/context/Auth";
import { UserProvider, useUserContext } from "@/context/UserContext";
import httpUserClient from "@/http/user";
import { IPagination, UserListResponseDto } from "@/models/dtos";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const HelloWorld = () => {
  const { user: currentUser } = useAuth();
  const {offset} = useUserContext()
  const { list } = httpUserClient();

  
  const { data, refetch: refetchUsers } = useQuery<UserListResponseDto>({
    queryKey: ["listUsers", offset],
    queryFn: async () => await list({limit: 5, offset}),
    refetchOnWindowFocus: false,
    staleTime: (60 * 5) * 1000,
  });

  const {users, pagination} = data!

  return (
      <>
        <h1>Hello {currentUser?.username}!</h1>
        <div>
          {users && <UsersTable users={users} pagination={pagination}/>}
        </div>
      </>
    
  );
};

export default HelloWorld;
