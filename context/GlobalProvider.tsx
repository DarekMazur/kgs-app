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
};

const GlobalContext = createContext(initialContext);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [user, setUser] = useState(initNewUser);

  const setGlobalUser = (newUser: IRegisterProps) => {
    setUser({ ...newUser });
  };

  return (
    <GlobalContext.Provider value={{ user, setGlobalUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
