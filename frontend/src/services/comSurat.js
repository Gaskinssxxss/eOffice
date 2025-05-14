import Api from "./api";

export default {
  getAllSurat() {
    return Api.get("/surat");
  },

  getByIdSurat(id) {
    return Api.get(`/surat/${id}`);
  },

  createSurat(data) {
    return Api.post("/surat", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateSurat(id, data) {
    return Api.put(`/surat/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  updateSuratKeterangan(id, data) {
    return Api.put(`/surat/${id}/keterangan`, data);
  },

  updateStatusSurat(id, status) {
    return Api.put(`/surat/${id}/status`, { status });
  },

  updateSignatureReplace(id, formData) {
    return Api.put(`/surat/${id}/signature-replace`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteSurat(id) {
    return Api.delete(`/surat/${id}`);
  },
};
