import { useAuth } from "@/context/Auth"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const Logout = () => {
    // const queryClient = useQueryClient()
    const {logout} = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
       logout()
       navigate('/login')
    },[logout, navigate])

    return (
        <div>Logged Out!</div>
    )
}

export  { Logout }