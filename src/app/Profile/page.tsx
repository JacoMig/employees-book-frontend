import ProfileForm from "@/components/profileForm";
import { useAuth } from "@/context/Auth";


const ProfilePage = () => {
    const { user } = useAuth();
    if(!user) return 
    
    return (
      <ProfileForm user={user}/>
    )
}


export  {ProfilePage}