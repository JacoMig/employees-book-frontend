import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { IPagination, IUser } from '@/models/dtos'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'
import { Pagination } from './Pagination'
import { useMemo } from 'react'
import { useAuth } from '@/context/Auth'
import { Button } from './ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import httpUserClient from '@/http/user'

const UsersTable = ({
    users,
    pagination,
}: {
    users: IUser[]
    pagination: IPagination
}) => {
    const { user: currentUser } = useAuth()
    const { remove } = httpUserClient()

    const { toast } = useToast()
    const queryClient = useQueryClient()

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => await remove(id),
        mutationKey: ['deleteUser'],
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['listUsers'],
            })

            toast({
                title: 'User deleted successfully!',
            })
        },
    })

    const userInitials = (user: IUser) => {
        if (!user.firstName || !user.lastName)
            return user.username.substring(0, 2)
        return `${user.firstName?.substring(0, 1)} ${user.lastName?.substring(
            0,
            1
        )}`
    }

    const isSuperAdmin = useMemo(() => {
        return currentUser?.userGroup.includes('superadmin')
    }, [])

    return (
        <>
            <Table className="my-10">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Username</TableHead>
                        <TableHead className="text-center">Full name</TableHead>
                        <TableHead className="text-center">Job title</TableHead>
                        <TableHead className="text-center">
                            Hiring date
                        </TableHead>
                        <TableHead className="text-center">Resume</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, i) => (
                        <TableRow key={`${user.id}-${i}`}>
                            <TableCell className="font-medium flex items-center flex-col">
                                <Avatar>
                                    <AvatarImage src={user.profileImage} />
                                    <AvatarFallback>
                                        {userInitials(user)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>{user.username}</div>
                            </TableCell>
                            <TableCell>
                                {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.jobTitle}</TableCell>
                            <TableCell>
                                {user.hiringDate
                                    ? new Date(user.hiringDate).toDateString()
                                    : ''}
                            </TableCell>
                            <TableCell>
                                {user.cvUrl && (
                                    <Link to={user.cvUrl} target="_blank">
                                        {decodeURI(
                                            user.cvUrl.split('/').pop()!
                                        )}
                                    </Link>
                                )}
                            </TableCell>

                            <TableCell>
                                {isSuperAdmin &&
                                    user.id !== currentUser?.id && (
                                        <Button
                                            onClick={() =>
                                                deleteMutation.mutate(user.id)
                                            }
                                            variant="destructive"
                                        >
                                            Delete
                                        </Button>
                                    )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination pagination={pagination} />
        </>
    )
}

export { UsersTable }
