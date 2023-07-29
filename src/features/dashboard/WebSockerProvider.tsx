import { ReactNode, createContext, useEffect, useRef, useState } from 'react';

import { useAccount } from '@/features/account/service';
import { Bet } from '@/features/dashboard/service';

export type WebSocketMessage = {
  type: 'connect' | 'message';
  username: string;
  targetUsername?: string;
  details?: {
    description: string;
  };
};

const WebSocketContext = createContext<{
  messages: WebSocketMessage[];
  send: (
    message:
      | WebSocketMessage
      | Omit<Bet, 'sender' | 'betStatus' | 'createdByUserId' | 'id'>
  ) => void;
}>({
  messages: [],
  send: () => {
    return;
  },
});

const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Array<WebSocketMessage>>([]);
  const { data: user } = useAccount();

  const ws = useRef<WebSocket | null>(null);

  const sendFunction = (
    message:
      | WebSocketMessage
      | Omit<Bet, 'sender' | 'betStatus' | 'createdByUserId' | 'id'>
  ) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.error('Cannot send message, WebSocket is not open');
    }
  };

  useEffect(() => {
    // Only proceed if user data is available.
    if (!user || !user.login) return;

    ws.current = new WebSocket('ws://localhost:8080');

    const wsInstance = ws.current;

    const handleOpen = () => {
      console.log('Connected');
    };

    const handleClose = () => console.log('Disconnected');
    const handleError = console.error;

    wsInstance.addEventListener('open', handleOpen);
    wsInstance.addEventListener('close', handleClose);
    wsInstance.addEventListener('error', handleError);

    wsInstance.onmessage = (event) => {
      setMessages((messages) => [...messages, JSON.parse(event.data)]);
    };

    return () => {
      wsInstance.removeEventListener('open', handleOpen);
      wsInstance.removeEventListener('close', handleClose);
      wsInstance.removeEventListener('error', handleError);
      wsInstance.close();
    };
  }, [user]);

  // useEffect to send 'connect' message after WebSocket and user data are ready.
  useEffect(() => {
    if (
      ws.current &&
      ws.current.readyState === WebSocket.OPEN &&
      user &&
      user.login
    ) {
      sendFunction({ type: 'connect', username: user.login });
    }
  }, [ws.current, user]);

  return (
    <WebSocketContext.Provider value={{ messages, send: sendFunction }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext, WebSocketProvider };
