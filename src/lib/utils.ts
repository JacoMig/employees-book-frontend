import { formSchema } from "@/components/profileForm"
import { PatchUser } from "@/models/dtos"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {  z } from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type AllValues = z.infer<typeof formSchema>

export function getDirtyFieldsValues(dirtyFields:object, allValues:AllValues) {
  const formValues:Record<string, unknown> = {}
  
  for(const field in dirtyFields) {
    formValues[field as keyof PatchUser] = allValues[field as keyof AllValues]
    
  }
  return formValues as PatchUser
}



export const debounce = function(delay:number, cb: () => void) {
  let timer:NodeJS.Timeout;
    
  return function () {
  
    clearTimeout(timer);
  
    timer = setTimeout(() => {cb()}, delay);
  };
};