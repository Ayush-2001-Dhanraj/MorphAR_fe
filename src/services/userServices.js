import apiRequest from "../utils/apiRequest";

const UserService = {
  registerUser: async (data) =>
    await apiRequest("POST", `api/users/register`, data),
};

export default UserService;
