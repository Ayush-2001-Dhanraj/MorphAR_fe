import apiRequest from "../utils/apiRequest";

const TripoService = {
  createTask: async (file) => {
    const formData = new FormData();
    formData.append("file", file, "image.png");

    // Hitting your own backend route: /api/tasks
    return await apiRequest("POST", `api/tasks`, formData);
  },

  getTaskStatus: async (taskId) => {
    // Hitting your own backend route: /api/tasks/:taskId/status
    return await apiRequest("GET", `api/tasks/${taskId}/status`);
  },
};

export default TripoService;
