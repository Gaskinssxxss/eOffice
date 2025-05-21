const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const suratSchema = new Schema({
  surat_dari: {
    type: String,
    required: false,
  },
  noSurat: {
    type: String,
    required: false,
  },
  tglSurat: {
    type: String,
    required: false,
  },
  diterimaTgl: {
    type: String,
    required: false,
  },
  noAgenda: {
    type: String,
    required: false,
  },
  sifatSurat: {
    type: String,
    required: false,
    enum: ["Segera", "Penting", "Rahasia", "Biasa"],
  },
  perihal: {
    type: String,
    required: false,
  },
  diteruskanKepada: {
    type: [String],
    required: false,
    enum: [
      "Kepala Bagian Perencanaan dan Pelaporan",
      "Kepala Bagian Protokol",
      "Kepala Bagian Materi dan Komunikasi Pimpinan",
      "Kepala Sub Bagian Tata Usaha",
    ],
  },
  disposisi: {
    type: [String],
    required: false,
    enum: [
      "Proses Tindak Lanjut",
      "Tanggapan dan Saran",
      "Jadwalkan",
      "Wakili/Dampingi",
      "Koordinasikan",
      "File/Arsip",
    ],
  },
  catatan: {
    type: String,
    required: false,
  },
  parafLembarDisposisi: {
    type: String,
    required: false,
  },
  tglParafLembarDisposisi: {
    type: String,
    required: false,
  },
  statusSurat: {
    type: String,
    required: false,
  },
  statusLampiran: {
    type: String,
    required: false,
  },
  lampiran: {
    type: [String],
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SuratSchema", suratSchema);
