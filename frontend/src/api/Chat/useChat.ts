import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";


const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const API_URL = import.meta.env.VITE_API_URL; // adjust if needed

interface Message {
  id?: string;
  groupId: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp?: string;
}

export const useChat = (groupId: string, userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);

  // ✅ Fetch message history on initial mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/${groupId}`, {
            method: "GET",
            credentials: "include", // 👈 This is the equivalent of withCredentials: true
          });
          
        const data: Message[] = await res.json();

        // Format timestamps
        const formatted = data.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp).toLocaleString() : "",
        }));

        setMessages(formatted);
      } catch (err) {
        setError(`Failed to fetch chat history. ${err}`);
      }
    };

    fetchHistory();
  }, [groupId]);

  // ✅ WebSocket connection
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),
      onConnect: () => {
        setIsConnected(true);
        client.subscribe(`/topic/messages/${groupId}`, (message) => {
          const received = JSON.parse(message.body) as Message;
          received.timestamp = new Date(received.timestamp || "").toLocaleString();

          setMessages((prev) => [...prev, received]);
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (frame) => {
        setError(`Error: ${frame.headers["message"]}`);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [groupId]);

  const sendMessage = (content: string) => {
    if (!isConnected) {
      setError("Unable to send message, WebSocket is disconnected.");
      return;
    }

    const message: Message = {
      groupId,
      senderId: userId,
      content,
    };

    try {
      clientRef.current?.publish({
        destination: `/app/chat.send/${groupId}`,
        body: JSON.stringify(message),
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error sending message: ${err.message}`);
      } else {
        setError("Error sending message: Unknown error");
      }
    }
  };

  return { messages, sendMessage, isConnected, error };
};
