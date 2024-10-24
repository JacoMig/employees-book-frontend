import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { IPagination, IUser } from '@/models/dtos'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from 'react-router-dom'
import { Pagination } from './Pagination'

const UsersTable = ({
    users,
    pagination,
}: {
    users: IUser[]
    pagination: IPagination
}) => {
    const userInitials = (user: IUser) => {
        if (!user.firstName || !user.lastName)
            return user.username.substring(0, 2)
        return `${user.firstName?.substring(0, 1)} ${user.lastName?.substring(
            0,
            1
        )}`
    }

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
                            <TableCell className="text-right">
                                {user.cvUrl && (
                                    <Link to={user.cvUrl} target="_blank">
                                        {decodeURI(
                                            user.cvUrl.split('/').pop()!
                                        )}
                                    </Link>
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
