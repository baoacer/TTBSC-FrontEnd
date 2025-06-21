import {
  ask, getChatHistory
} from "../api/chat";
import { useUser } from "./useUser"

export function useChat() {
    const { user } = useUser();

  const fetchChatHistory = async () => {
    try {
        debugger
      const res = await getChatHistory(user.value._id);
      return res.data?.metadata || "";
    } catch (e) {
      throw new Error(e.message);
    } 
  };

  const askChat = async (message) => {
    try {
      const res = await ask(user.value._id, message);
      return res.data?.metadata.reply || "";
    } catch (e) {
      throw new Error(e.message);
    } 
  };

  return {
    fetchChatHistory,
    askChat
  };
}