import {  getDecodedToken } from "@/context/Auth";
import { BadRequestError, ForbiddenError, NotFoundError, UknownError, UnauthorizedError } from "./errors";

const ApiClient = async <T>(
  url: string,
  options: RequestInit,
  isAuthorized: boolean = true
): Promise<T> => {
  const { token } = getDecodedToken();
 
  const response = await fetch(url, {
    ...options,
    headers: isAuthorized
      ? { ...options.headers, Authorization: "Bearer " + token }
      : options.headers,
  });
  
  if(!response.ok) {
    const message = response.statusText
    switch(response.status) {
      case 400:
        throw new BadRequestError(message)     
      case 401:
        throw new UnauthorizedError(message)
      case 403:
        throw new ForbiddenError(message)
      case 404:
        throw new NotFoundError(message)    
      default : throw new UknownError()          
    }
    
  }

  const data =  response.json();
  
  return data as T;
 
  
   
  
};

export default ApiClient;
