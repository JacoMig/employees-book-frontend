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


let timer:NodeJS.Timeout;
export const debounce = function(delay:number, cb: () => void) {
  
  // Return an anonymous function that takes in any number of arguments
  return function () {
    // Clear the previous timer to prevent the execution of 'mainFunction'
    clearTimeout(timer);
    // Set a new timer that will execute 'mainFunction' after the specified delay
    timer = setTimeout(() => {cb()}, delay);
  };
};