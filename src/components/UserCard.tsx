import { IUser } from "@/models/dtos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useMemo } from "react";
import { useAuth } from "@/context/Auth";
import httpUserClient from "@/http/user";

const UserCard = ({user, deleteUserCallback} : {user:IUser, deleteUserCallback:() => void}) => {
    const {user:currentUser} = useAuth()
    const {remove} = httpUserClient()

    const canDeleteUser = useMemo(() => {
      return currentUser?.userGroup.includes('superadmin')
    }, [])
    
    const deleteUser = async () => {
      if(canDeleteUser) {
        await remove(user.id)
        deleteUserCallback()
      }
    }
   
    return (
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{user.firstName} {user.lastName}</CardTitle>
            <CardDescription>
                {user.jobTitle}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <p>{user.email}</p>
              </div>
              <div className="grid gap-2">
                {canDeleteUser &&
                  (
                    <Button type="submit" onClick={deleteUser} className="w-full">
                      Delete User
                  </Button>
                  ) 
                }
                
              </div>
            </div>    
          </CardContent>
        </Card>
      );
}

export {UserCard}