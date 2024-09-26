import { createContext, FC, ReactElement, useContext, useState } from 'react';
import { initNewUser, IRegisterProps } from '@/app/(auth)/sign-up';

const initialContext = {
  isLogged: false,
  setGlobalIsLogged: () => {},
  user: initNewUser,
  setGlobalUser: (newUser: IRegisterProps) => {},
};

const GlobalContext = createContext(initialContext);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(initNewUser);

  const setGlobalIsLogged = () => {
    setIsLogged((prevState) => !prevState);
  };

  const setGlobalUser = (newUser: IRegisterProps) => {
    setUser({ ...newUser });
  };

  return (
    <GlobalContext.Provider
      value={{ isLogged, setGlobalIsLogged, user, setGlobalUser }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
