import { createContext, FC, ReactElement, useContext, useState } from 'react';
import { IRegisterProps } from '@/lib/types';

export const initNewUser: IRegisterProps = {
  username: null,
  email: null,
  password: null,
};

const initialContext = {
  user: initNewUser,
  setGlobalUser: (newUser: IRegisterProps) => {},
  isLogged: false,
  setIsLoggedIn: () => {},
};

const GlobalContext = createContext(initialContext);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [user, setUser] = useState<IRegisterProps>(initNewUser);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const setGlobalUser = (newUser: IRegisterProps) => {
    setUser({ ...newUser });
  };

  const setIsLoggedIn = () => setIsLogged((prevState) => !prevState);

  return (
    <GlobalContext.Provider
      value={{ user, isLogged, setIsLoggedIn, setGlobalUser }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
