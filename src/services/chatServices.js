import apiRequest from "../utils/apiRequest";

const ChatService = {
  getChats: async (query) => await apiRequest("GET", `api/chats`, {}, query),
  getChat: async (id) => await apiRequest("GET", `api/chats/${id}`, {}),
  deleteChat: async (id) => await apiRequest("DELETE", `api/chats/${id}`, {}),
  createChat: async (data) => await apiRequest("POST", `api/chats`, data),
};

export default ChatService;
