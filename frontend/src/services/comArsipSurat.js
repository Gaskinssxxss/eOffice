import Api from "./api";

export default {
  getAllArsipSurat() {
    return Api.get("/hide/arsip");
  },
  getByIdArsipSurat(id) {
    return Api.get(`/hide/arsip/${id}`);
  },
  postArsipSurat(data) {
    return Api.post("/hide/arsip", data);
  },
};
