import { createContext, useContext, useState } from "react";

export interface IUserContext {
   offset: number,
   setOffset:  React.Dispatch<React.SetStateAction<number>>

}

const UserContext = createContext<IUserContext>({} as IUserContext);


export const UserProvider = ({children}:{children: React.ReactNode}) => {
    
    const [offset, setOffset] = useState(0)

    return (
        <UserContext.Provider
          value={{
            offset,
            setOffset
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
  