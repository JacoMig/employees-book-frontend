import {  getDecodedToken } from "@/context/Auth";
import { BadRequestError, ForbiddenError, NotFoundError, UknownError, UnauthorizedError } from "./errors";

const ApiClient = async <T>(
  url: string,
  options: RequestInit,
  isAuthorized: boolean = true
): Promise<T> => {
  //const { token } = getDecodedToken();
 
  const response = await fetch(url, {
    ...options,
    headers: isAuthorized
      ? { ...options.headers, Authorization: "Bearer " + getDecodedToken()?.token }
      : options.headers,
  });
  
  const data = await response.json()
  if(!response.ok) {
    
    switch(response.status) {
      case 400:
        throw new BadRequestError(data.message)     
      case 401:
        throw new UnauthorizedError(data.message)
      case 403:
        throw new ForbiddenError(data.message)
      case 404:
        throw new NotFoundError(data.message)    
      default : throw new UknownError()          
    }
    
  }

  return data as T;
 
};

export default ApiClient;
