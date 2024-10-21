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
            <Link to="/hello" className="[&.active]:font-bold">
              Hello
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
          <Link to="/login" className="[&.active]:font-bold">
            Login
          </Link>
        )}
      </div>
      <hr />
     <AuthGuardedRoute>
        <Outlet />
      </AuthGuardedRoute> 
    </>
  );
};

export default Navigation;
