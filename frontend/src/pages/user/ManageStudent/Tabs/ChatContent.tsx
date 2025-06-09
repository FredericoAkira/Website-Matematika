// components/GroupChat.tsx
import React, { useState } from "react";
import { useChat } from "../../../../api/Chat/useChat";
import usePostAddNotif, { AddNotifReq } from "../../../../api/Dashboard/Notification/usePostAddNotif";


interface GroupChatProps {
  groupId: string;
  userId: string;
  studentIds: string[];
}

const ChatContent: React.FC<GroupChatProps> = ({ groupId, userId, studentIds }) => {
  const { messages, sendMessage } = useChat(groupId, userId);
  const [text, setText] = useState("");
  const addNotification = usePostAddNotif();

  const handleSend = () => {
    if (text.trim() !== "") {
        if(messages.length < 1) {
            studentIds.forEach(item => {
                const data: AddNotifReq = {
                    senderId: groupId,
                    receiverId: item,
                    header: "New Message",
                    content: "you have a new group message",
                    status: "groupChat"
                }
                addNotification.mutate(data)
            })
        }
        sendMessage(text);
        setText("");
    }
  };

  return (
    <div className="p-4 border rounded max-w-xl mx-auto">
        <div className="h-64 overflow-y-auto border-b mb-2 p-2">
            {messages.map((msg, index) => {
                const isOwnMessage = msg.senderId === userId;

                return (
                <div
                    key={index}
                    className={`mb-1 flex flex-col ${
                    isOwnMessage ? "items-end text-right" : "items-start"
                    }`}
                >
                    <strong className="text-[12px]">{msg.senderName}</strong>
                    <div className="flex flex-row gap-2">
                        <span className="bg-blue-300 py-2 px-4 rounded-lg">{msg.content}</span>
                    </div>
                    <p className="text-[10px] mt-1 text-gray-500">
                        {new Date(msg.timestamp ?? "").toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        })}
                    </p>
                </div>
                );
            })}
        </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="bg-blue-500 text-white px-4 py-1 rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatContent;
