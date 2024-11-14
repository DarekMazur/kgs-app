import {
  createContext,
  FC,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IPublicUser } from '@/lib/types';

interface IContext {
  user: IPublicUser;
  setGlobalUser: (newUser: IPublicUser) => void;
  unreadMessages: number | undefined;
}

export const initNewUser: IPublicUser = {
  id: null,
  username: null,
  email: null,
  password: null,
  registrationDate: 0,
  isBanned: false,
  suspensionTimeout: undefined,
  totalSuspensions: 0,
  role: { id: 3, name: 'User', type: 'user' },
  isConfirmed: false,
  messages: [],
};

const initialContext: IContext = {
  user: initNewUser,
  setGlobalUser: (newUser: IPublicUser) => {},
  unreadMessages: undefined,
};

const GlobalContext = createContext(initialContext);
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider: FC<{ children: ReactElement }> = ({ children }) => {
  const [user, setUser] = useState<IPublicUser>(initNewUser);
  const [unreadMessages, setUnreadMessages] = useState<number | undefined>();

  useEffect(() => {
    if (user) {
      setUnreadMessages(
        user.messages.filter((message) => !message.openedTime).length,
      );
    }
  }, [user]);

  const setGlobalUser = (newUser: IPublicUser) => {
    setUser({ ...newUser });
  };

  return (
    <GlobalContext.Provider value={{ user, setGlobalUser, unreadMessages }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
