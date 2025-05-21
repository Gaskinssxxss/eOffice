import Api from "./api";

export default {
  getUsersAll() {
    return Api.get(`/users/all`);
  },

  getUsersByStatus(status) {
    return Api.get(`/users/status/${status}`);
  },

  getUserById(id) {
    return Api.get(`/users/${id}`);
  },

  createUser(data) {
    return Api.post("/users/register", data);
  },

  updateUserStatus(id, status) {
    return Api.put(`/users/${id}/status`, { status });
  },

  updateStatusUser(id, status) {
    return Api.put(`/users/${id}/status`, { status });
  },

  deleteUser(id) {
    return Api.delete(`/users/${id}`);
  },
};
