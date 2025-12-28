import { message } from 'antd';
import React from 'react';

const Context = React.createContext<{
  messageInstance: ReturnType<typeof message.useMessage>[0];
}>(null!);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [messageInstance, contextHolder] = message.useMessage();
  return (
    <Context.Provider value={{ messageInstance }}>
      {contextHolder}
      {children}
    </Context.Provider>
  );
};

export const useNotificationContext = () => React.useContext(Context);
