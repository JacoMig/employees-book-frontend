import { useAuth } from '@/context/Auth'
import { Navigate, useLocation } from 'react-router-dom'

const AuthGuardedRoute = ({
    children,
    excludeRoutes,
    nextRoute,
}: {
    children: React.ReactNode | (() => JSX.Element)
    excludeRoutes: string[]
    nextRoute?: string
}) => {
    const location = useLocation()
    const { isLoading, user } = useAuth()

    const currentPath = location.pathname

    if (isLoading) return

    if (
        !user &&
        !currentPath.includes('login') &&
        !excludeRoutes.includes(currentPath)
    )
        return <Navigate to={'/login'} />

    if (nextRoute) return <Navigate to={nextRoute} />

    return <>{children}</>
}

export default AuthGuardedRoute
