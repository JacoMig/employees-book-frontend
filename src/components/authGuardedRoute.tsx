import { useAuth } from "@/context/Auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";


import { Navigate, useLocation } from "react-router-dom";

const AuthGuardedRoute = ({
  children,
  nextRoute,
}: {
  children: React.ReactNode | (() => JSX.Element);
  nextRoute?: string
}) => {
  const location = useLocation();
  const {isLoading, user} = useAuth()
  
  if (isLoading) return;

  if (!user && !location.pathname.includes('login')) 
    return <Navigate to={"/login"} />;
  

  if(nextRoute) 
    return <Navigate to={nextRoute} />;
  

  return <>{children}</>;
};

export default AuthGuardedRoute;
