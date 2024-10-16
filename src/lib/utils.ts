import { formSchema } from "@/components/profileForm"
import { PatchUser } from "@/models/dtos"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { unknown, z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function getDirtyFieldsValues(dirtyFields:object, allValues:z.infer<typeof formSchema>) {
  let formValues:Record<string, any> = {}
  let allValuesObject = allValues as Record<string, any>
  
  for(let field in dirtyFields) {
    
    formValues[field as keyof PatchUser] = allValuesObject[field]
  }
  return formValues as PatchUser
}