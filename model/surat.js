const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ArsipSurat = require("./arsipSurat");

const surat = new Schema({
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
  },
  tanggalTindakLanjut: {
    type: Date,
    default: Date.now,
  },
  keterangan: {
    type: String,
  },
});

surat.post("save", async function (doc) {
  try {
    await ArsipSurat.create({
      idSurat: doc._id.toString(),
      nomorSurat: doc.nomorSurat,
      lampiran: doc.lampiran,
      perihal: doc.perihal,
      status: doc.status,
      penerima: doc.penerima,
      pengirim: doc.pengirim,
      isiTidakLanjut: doc.isiTidakLanjut,
      tanggalTindakLanjut: doc.tanggalTindakLanjut,
      keterangan: doc.keterangan,
      method: "POST",
    });
  } catch (e) {
    console.error("Gagal archive pas save:", e);
  }
});

surat.post("findOneAndUpdate", async function (doc) {
  if (!doc) return;
  try {
    await ArsipSurat.create({
      idSurat: doc._id.toString(),
      nomorSurat: doc.nomorSurat,
      lampiran: doc.lampiran,
      perihal: doc.perihal,
      status: doc.status,
      penerima: doc.penerima,
      pengirim: doc.pengirim,
      isiTidakLanjut: doc.isiTidakLanjut,
      tanggalTindakLanjut: doc.tanggalTindakLanjut,
      keterangan: doc.keterangan,
      method: "PUT",
    });
  } catch (e) {
    console.error("Gagal archive pas update:", e);
  }
});

surat.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  try {
    await ArsipSurat.create({
      idSurat: doc._id.toString(),
      nomorSurat: doc.nomorSurat,
      lampiran: doc.lampiran,
      perihal: doc.perihal,
      status: doc.status,
      penerima: doc.penerima,
      pengirim: doc.pengirim,
      isiTidakLanjut: doc.isiTidakLanjut,
      tanggalTindakLanjut: doc.tanggalTindakLanjut,
      keterangan: doc.keterangan,
      method: "DELETE",
    });
  } catch (e) {
    console.error("Gagal archive pas delete:", e);
  }
});

module.exports = mongoose.model("Surat", surat);

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const surat = new Schema({
//   nomorSurat: {
//     type: String,
//     required: true,
//   },
//   lampiran: {
//     type: [String],
//     required: true,
//   },
//   perihal: {
//     type: String,
//     required: true,
//   },
//   pengirim: {
//     type: String,
//     required: true,
//   },
//   penerima: {
//     type: String,
//     required: true,
//   },
//   status: {
//     type: String,
//     required: true,
//     enum: [
//       "dikirim",
//       "diterima",
//       "dibaca",
//       "ditandatangani",
//       "ditolak",
//       "revisi",
//       "direvisi",
//     ],
//   },
//   isiTidakLanjut: {
//     type: String,
//     required: false,
//   },
//   tanggalTindakLanjut: {
//     type: Date,
//     required: true,
//     default: Date.now(),
//   },
//   keterangan: {
//     type: String,
//     required: false,
//   },
// });

// const Surat = mongoose.model("Surat", surat);
// module.exports = Surat;
