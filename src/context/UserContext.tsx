import { createContext, useContext, useState } from "react";

export interface IUserContext {
   offset: number,
   setOffset:  React.Dispatch<React.SetStateAction<number>>
   username?: string,
   setUsername: React.Dispatch<React.SetStateAction<string | undefined>>
}

const UserContext = createContext<IUserContext>({} as IUserContext);


export const UserProvider = ({children}:{children: React.ReactNode}) => {
    
    const [offset, setOffset] = useState(0)
    const [username, setUsername] = useState<string | undefined>()

    return (
        <UserContext.Provider
          value={{
            offset,
            username,
            setOffset,
            setUsername
          }}
        >
          {children}
        </UserContext.Provider>
      );
}


export const useUserContext = () => {
    const context = useContext(UserContext);
  
    if (!context) {
      throw new Error("context must be used with an UserProvider");
    }
    return context;
  };
  