import { useState } from 'react'
import { Input } from './ui/input'
import { useUserContext } from '@/context/UserContext'
import { debounce } from '@/lib/utils'

export const SearchBar = () => {
    const { setUsername } = useUserContext()
  
    const [inputValue, setInputValue]= useState("")

    const handleChange = (value: string) => {
        setInputValue(value)
        debounce(300, async function (){ 
            setUsername(value)
        })()
    }
  
    
    return (
        <div className="searchBar w-64">
            <Input
                type="text"
                value={inputValue || ""}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Search by username"
            />
        </div>
    )
}
