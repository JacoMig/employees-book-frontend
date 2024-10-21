import { IPagination } from '@/models/dtos'
import { Button } from './ui/button'
import { useUserContext } from '@/context/UserContext'
import { useQueryClient } from '@tanstack/react-query'

const Pagination = ({ pagination }: { pagination: IPagination }) => {
    const {setOffset} = useUserContext()
    const queryClient = useQueryClient();

    const changePage = (dir:"prev" | "next") => {
        if(dir === "prev") 
            setOffset((v) => v - 1)
        else
            setOffset((v) => v + 1)
        
        queryClient.invalidateQueries({
            queryKey: ["listUsers"],
        });
    }

    const isNextDisabled = pagination.pages === pagination.currentPage
    const isPrevDisabled = pagination.offset === 0

    return (
        <div className="flex justify-end items-center my-6">
            <Button disabled={isPrevDisabled} type="button" onClick={() => changePage("prev")}>Prev</Button>
            <p>
                {pagination.currentPage} / {pagination.pages}
            </p>
            <Button disabled={isNextDisabled} type="button" onClick={() => changePage("next")}>Next</Button>
        </div>
    )
}

export { Pagination }
