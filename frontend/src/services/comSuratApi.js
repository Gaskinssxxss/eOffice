import Api from "./api";

export default {
  getAllSuratApi() {
    return Api.get("/hide/surat");
  },

  getByIdSuratApi(id) {
    return Api.get(`/hide/surat/${id}`);
  },

  createSuratApi(data) {
    return Api.post("/hide/surat", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateSuratApi(id, data) {
    return Api.put(`/hide/surat/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteSuratApi(id) {
    return Api.delete(`/hide/surat/${id}`);
  },
};
