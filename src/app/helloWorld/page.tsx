import { UserCard } from "@/components/UserCard";
import { useAuth } from "@/context/Auth";
import httpUserClient from "@/http/user";
import { IUser } from "@/models/dtos";
import { useCallback, useEffect, useState } from "react";
/* import { useUserHook } from "@/hooks/useUser.hook"
import { IUser } from "@/models/dtos";
import { useQuery, useQueryClient } from "@tanstack/react-query" */

export const HelloWorld = () => {
   const {user: currentUser} = useAuth()
   const [users, setUsers] = useState<IUser[]>() 
   const {list} = httpUserClient()
   
   const fetchList = useCallback(async () => {
    const userslist = await list()
    setUsers(userslist)
    }, [])
   
   useEffect(() => {
    fetchList()
   }, [])
   
    return (
        <>
            <h1>Hello {currentUser?.username}!</h1>
            <div className="grid grid-cols-4 gap-4">
                {users?.map(u => {
                    return <UserCard key={u?.id} deleteUserCallback={fetchList} user={u}/>
                })}
            </div>
        </>
    )
}

export default HelloWorld