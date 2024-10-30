import { SearchBar } from "@/components/SearchBar";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { UsersTable } from "@/components/UsersTable";
import { useAuth } from "@/context/Auth";
import { useUserContext } from "@/context/UserContext";
import httpUserClient from "@/http/user";
import { UserListResponseDto } from "@/models/dtos";
import { useQuery } from "@tanstack/react-query";

export const HelloWorld = () => {
  const { user: currentUser } = useAuth();
  const {offset, username} = useUserContext()
  const { list } = httpUserClient();

  
  const { data, isSuccess, isLoading } = useQuery<UserListResponseDto>({
    queryKey: ["listUsers", offset, username],
    queryFn: async () => await list({limit: 5, offset, username}),
    refetchOnWindowFocus: false,
    staleTime: (60 * 2) * 1000,
  });

  
    return (
        <>
          <h1>Hello {currentUser?.username}!</h1>
          <div>
            <SearchBar />
            {isLoading ? <Spinner></Spinner> : 
              (data &&  <UsersTable users={data.users} pagination={data.pagination}/>)
            }
            
          </div>
        </>
      
    );
  
  
};

export default HelloWorld;
