import { useAuth } from '@/context/Auth'
import { Link, Outlet, useLocation } from 'react-router-dom'
import AuthGuardedRoute from './authGuardedRoute'
import { Toaster } from './ui/toaster'

const Navigation = () => {
    const { user } = useAuth()
    const location = useLocation()
    const currentPath = location.pathname
    return (
        <>
            <div className="p-2 flex gap-2">
                {user ? (
                    <>
                        <Link to="/" className="[&.active]:font-bold">
                            Employees
                        </Link>
                        <Link to="/profile" className="[&.active]:font-bold">
                            Profile
                        </Link>
                    </>
                ) : null}

                <div className="ml-auto">
                    {user ? (
                        <Link to="/logout" className="[&.active]:font-bold">
                            Logout
                        </Link>
                    ) : (
                        currentPath.includes('sign-up') ? 
                        <Link to="/login" className="[&.active]:font-bold">
                            Login
                        </Link>
                        :
                        <Link to="/sign-up" className="[&.active]:font-bold">
                            Sign up
                        </Link>
                    )}
                </div>
            </div>
            <hr />
            <AuthGuardedRoute excludeRoutes={['/sign-up']}>
                <div className="py-12 h-5/6">
                    <Outlet />
                </div>
                <Toaster />
            </AuthGuardedRoute>
        </>
    )
}

export default Navigation
