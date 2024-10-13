import { IUser } from "@/models/dtos";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { createContext } from "react";
import { jwtDecode } from "jwt-decode";

import httpUserClient from "@/http/user";
import { Spinner } from "@/components/ui/spinner";
import { Navigate, useNavigate } from "react-router-dom";

export interface IAuthContext {
  logout: () => void
  login: (email: string, password: string) => void
  getUser: () => void
  user: IUser | undefined;
  isLoading: boolean;
}

export type DecodedToken = {
  token: string;
  decoded?: {
    expiresIn: string;
    iat: number;
    payload: {
      email: string;
      id: string;
      userGroup: string;
      username: string;
    };
  };
};

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const key = "auth.token";

export function getDecodedToken(): DecodedToken {
  const token = localStorage.getItem(key);

  return {
    token: token || "",
    decoded: token ? jwtDecode(token) : undefined,
  };
}

export function setStoredToken(token: string) {
  localStorage.setItem(key, token);
}

export function removeStoredToken() {
  localStorage.removeItem(key)
}


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { get, login:userLogin } = httpUserClient();
  const [user, setUser] = useState<IUser>()
  const [isLoading, setIsLoading] = useState(true)
  /* const [isError, setIsError] = useState(false) */
 
 

  const getUser = async () => {
    setIsLoading(true)
    console.log('getUser')  
    const { decoded } = getDecodedToken();
    if(!decoded?.payload.id) {
      setIsLoading(false)
      return
    }
   
    try {
      const u = await get(decoded?.payload.id)
      if(u) 
        setUser(u)
    }catch(e) {
      console.log(e)  
    }
    finally{
      setIsLoading(false)
    }
  }

  const login = useCallback(async (email: string, password: string) => {
    const response = await userLogin(email!, password!)
    setStoredToken(response.token)
    
  }, [])
  
  const logout = useCallback(() => {
    setUser(undefined)
    removeStoredToken()
  }, [])


  useEffect(() => {
    getUser()
    console.log('auth useEffect')
  }, [])

  console.log('auth')

  if(isLoading) 
    return <div><Spinner /></div>

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        getUser,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
 
  if (!context) {
    throw new Error("context must be used with an AuthProvider");
  } 
  return context;
};
