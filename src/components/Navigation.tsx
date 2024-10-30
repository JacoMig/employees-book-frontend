import { useAuth } from "@/context/Auth";
import { Link, Outlet } from "react-router-dom";
import AuthGuardedRoute from "./authGuardedRoute";

const Navigation = () => {
  const { user } = useAuth();
  
  return (
    <>
      <div className="p-2 flex gap-2">
        {user ? (
          <>
            <Link to="/" className="[&.active]:font-bold">
              Home
            </Link>
            <Link to="/profile" className="[&.active]:font-bold">
              Profile
            </Link>
          </>
        ) : null}
        {user ? (
          <Link to="/logout" className="[&.active]:font-bold">
            Logout
          </Link>
        ) : (
          <Link to="/sign-up" className="[&.active]:font-bold">
            Sign up
          </Link>
        )}
      </div>
      <hr />
      <AuthGuardedRoute excludeRoutes={[
        '/sign-up'
      ]}>
        <Outlet />
      </AuthGuardedRoute> 
    </>
  );
};

export default Navigation;
