import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCallback } from 'react'
import { PlusIcon } from '@radix-ui/react-icons'
import httpUserClient from '@/http/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/Auth'

const ActionsBar = () => {
    const { toast } = useToast()
    const { createRandomUsers } = httpUserClient()
    const { user } = useAuth()
    const currentUser = user!
    const queryClient = useQueryClient()

    const createRandomUsersMutation = useMutation({
        mutationFn: async (num: number) =>
            await createRandomUsers({
                num,
                companyId: currentUser.companyId,
                companyName: currentUser.companyName,
            }),
        mutationKey: ['createRandomUsers'],
        onSuccess: async () => {
            queryClient.invalidateQueries({
                queryKey: ['listUsers'],
            })
        },
        onError: (e) => {
            toast({
                title: 'Error while creating users',
                description: e.message,
                variant: 'destructive',
            })
        },
    })

    const addEmployees = useCallback(
        (num: number) => {
            createRandomUsersMutation.mutate(num)
        },
        [createRandomUsersMutation]
    )

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger
                    title="add employees"
                    className="p-2 border border-white rounded-full"
                >
                    <PlusIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => addEmployees(5)}>
                        5
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addEmployees(10)}>
                        10
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addEmployees(20)}>
                        20
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export { ActionsBar }
