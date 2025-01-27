import ProfileForm from "@/components/profileForm";
import { Spinner } from "@/components/ui/spinner";
import httpUserClient from "@/http/user";
import { IUser } from "@/models/dtos";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";


const ProfilePage = () => {
  const params = useParams()
  const { get } = httpUserClient();
  const userId = params.id 
  
  const { data: user, isLoading} = useQuery({
     queryKey: ["getUser", userId],
     retry: false,
     enabled: !!userId,
     queryFn: async ():Promise<IUser> => {
        return await get(userId as string)
     },
     refetchOnWindowFocus: false,
   });

  if(isLoading) return (
    <Spinner></Spinner>
  ) 

  if (!user) return (<div>User does not exist</div>);
   
  return ( <ProfileForm user={user} />);
};

export { ProfilePage };
