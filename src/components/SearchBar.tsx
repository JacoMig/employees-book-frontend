import { useCallback, useMemo, useState } from 'react'
import { Input } from './ui/input'
import { useUserContext } from '@/context/UserContext'
import { debounce } from '@/lib/utils'

export const SearchBar = () => {
    const { setUsername } = useUserContext()

    const [inputValue, setInputValue] = useState('')

    const debouncedSetUsername = useMemo(
        () =>
            debounce(400, (value: string) => {
                setUsername(value)
            }),
        [setUsername]
    )

    const handleChange = useCallback(
        (value: string) => {
            setInputValue(value)
            debouncedSetUsername(value)
        },
        [setInputValue]
    )

    return (
        <div className="searchBar w-64">
            <Input
                type="text"
                value={inputValue || ''}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Search by username"
            />
        </div>
    )
}
