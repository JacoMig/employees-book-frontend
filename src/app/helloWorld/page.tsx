import { ActionsBar } from '@/components/ActionsBar'
import { SearchBar } from '@/components/SearchBar'

import { Spinner } from '@/components/ui/spinner'
import { UsersTable } from '@/components/UsersTable'
import { useAuth } from '@/context/Auth'
import { useUserContext } from '@/context/UserContext'
import httpUserClient from '@/http/user'
import { UserListResponseDto } from '@/models/dtos'
import { useIsMutating, useQuery } from '@tanstack/react-query'


export const HelloWorld = () => {
    const { user } = useAuth()
    const currentUser = user!
    const { offset, username } = useUserContext()
    const { list } = httpUserClient()
  
    const isCreatingRandomUsers = useIsMutating({
        mutationKey: ['createRandomUsers'],
    })

    const { data, isLoading } = useQuery<UserListResponseDto>({
        queryKey: ['listUsers', offset, username],
        queryFn: async () =>
            await list({
                companyId: currentUser?.companyId,
                limit: 5,
                offset,
                username,
            }),
        refetchOnWindowFocus: false,
        //staleTime: 60 * 2 * 1000,
    })

   

    return (
        <>
            <h1>Hello {currentUser?.username}!</h1>
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center">
                    <SearchBar />
                    <ActionsBar />
                </div>

                {isLoading || isCreatingRandomUsers ? (
                    <Spinner></Spinner>
                ) : (
                    data && (
                        <UsersTable
                            users={data.users}
                            pagination={data.pagination}
                        />
                    )
                )}
            </div>
        </>
    )
}

export default HelloWorld
