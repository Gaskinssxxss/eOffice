const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const arsipSurat = new Schema({
  idSurat: {
    type: String,
    required: true,
  },
  nomorSurat: {
    type: String,
    required: true,
  },
  lampiran: {
    type: [String],
    required: true,
  },
  perihal: {
    type: String,
    required: true,
  },
  pengirim: {
    type: String,
    required: true,
  },
  penerima: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: [
      "dikirim",
      "diterima",
      "dibaca",
      "ditandatangani",
      "ditolak",
      "revisi",
      "direvisi",
    ],
  },
  isiTidakLanjut: {
    type: String,
    required: false,
  },
  tanggalTindakLanjut: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  keterangan: {
    type: String,
    required: false,
  },
  method: {
    type: String,
    required: true,
    enum: ["POST", "PUT", "DELETE"],
  },
  archivedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const ArsipSurat = mongoose.model("ArsipSurat", arsipSurat);
module.exports = ArsipSurat;
