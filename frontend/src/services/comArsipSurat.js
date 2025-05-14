import Api from "./api";

export default {
  getAllArsipSurat() {
    return Api.get("/arsipsurat");
  },
  getByIdArsipSurat(id) {
    return Api.get(`/arsipsurat/${id}`);
  },
  createArsipSurat(data) {
    return Api.post("/arsipsurat", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  updateArsipSurat(id, data) {
    return Api.put(`/arsipsurat/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  deleteArsipSurat(id) {
    return Api.delete(`/arsipsurat/${id}`);
  },
};
