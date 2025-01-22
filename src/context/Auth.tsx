import { IUser } from "@/models/dtos";
import React, {
  useCallback,
  useState,
} from "react";
import { createContext } from "react";
import { jwtDecode } from "jwt-decode";

import httpUserClient from "@/http/user";
import { Spinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";

export interface IAuthContext {
  logout: () => void;
  login: (email: string, password: string) => void;
  getUser: () => void;
  user: IUser | undefined;
  isLoading: boolean;
  isError: boolean
  setToken: React.Dispatch<React.SetStateAction<DecodedToken | undefined>>
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

export function getDecodedToken(): DecodedToken | undefined {
  const token = localStorage.getItem(key);
  if(!token) return undefined
  return {
    token: token,
    decoded:  jwtDecode(token)
  };
}

export function setStoredToken(token: string) {
  localStorage.setItem(key, token);
}

export function removeStoredToken() {
  localStorage.removeItem(key);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { get, login: userLogin } = httpUserClient();
  const [token, setToken] = useState(getDecodedToken())
  // const queryClient = useQueryClient()
  
  const { data: user, isLoading, refetch:getUser, isError } = useQuery({
    queryKey: ["getUser", token],
    retry: false,
    enabled: !!token,
    queryFn: async ():Promise<IUser> => {
      let id = ''
      if(token?.decoded?.payload.id) 
        id = token?.decoded?.payload.id
      
      return await get(id)
    },
    refetchOnWindowFocus: false,
  });
  

  const login = useCallback(async (email: string, password: string) => {
    const response = await userLogin(email!, password!);
    setStoredToken(response.token);
  }, [userLogin]);

  const logout = useCallback(() => {
    setToken(undefined)
    removeStoredToken();
    
  }, []);

  
  if (isLoading)
    return (
      <div>
        <Spinner />
      </div>
    );

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user,
        getUser,
        isLoading,
        isError,
        setToken
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
