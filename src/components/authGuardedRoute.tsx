import { useAuth } from '@/context/Auth'
import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const AuthGuardedRoute = ({
    children,
    excludeRoutes,
}: {
    children: ReactNode
    excludeRoutes: string[]
}): ReactNode => {
    const location = useLocation()
    const { isLoading, user } = useAuth()

    const currentPath = location.pathname

    if (isLoading) return <div>Loading...</div>

    if (
        !user &&
        !currentPath.includes('login') &&
        !excludeRoutes.includes(currentPath)
    )
        return <Navigate to={'/login'} />

    

    return (children)
}

export default AuthGuardedRoute
