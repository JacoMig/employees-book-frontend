import ProfileForm from "@/components/profileForm";
import { useAuth } from "@/context/Auth";
import { useEffect, useRef } from "react";

const ProfilePage = () => {
  const { user } = useAuth();
  if (!user) return;
 
  return (
    <>
      <ProfileForm user={user} />
    </>
  );
};

export { ProfilePage };
