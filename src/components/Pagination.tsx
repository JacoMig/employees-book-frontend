import { IPagination } from '@/models/dtos'
import { Button } from './ui/button'
import { useUserContext } from '@/context/UserContext'
import {
    DoubleArrowRightIcon,
    DoubleArrowLeftIcon,
} from '@radix-ui/react-icons'


const Pagination = ({ pagination }: { pagination: IPagination }) => {
    const { setOffset } = useUserContext()
    
    const changePage = (dir: 'prev' | 'next') => {
        if (dir === 'prev') setOffset((v) => v - 1)
        else setOffset((v) => v + 1)
    }

    const isNextDisabled = pagination.pages === pagination.currentPage
    const isPrevDisabled = pagination.offset === 0

    return (
        <div className="flex justify-end items-center mt-auto">
            <Button
                disabled={isPrevDisabled}
                type="button"
                variant="ghost"
                onClick={() => changePage('prev')}
            >
                <DoubleArrowLeftIcon />
            </Button>
            <p>
                page {pagination.currentPage} of {pagination.pages}
            </p>
            <Button
                disabled={isNextDisabled}
                type="button"
                 variant="ghost"
                onClick={() => changePage('next')}
            >
                <DoubleArrowRightIcon />
            </Button>
        </div>
    )
}

export { Pagination }
