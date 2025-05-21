const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "staf", "pimpinan"],
  },
  jabatan: {
    type: String,
    required: true,
    enum: [
      "staf",
      "Kepala Bagian Perencanaan dan Pelaporan",
      "Kepala Bagian Protokol",
      "Kepala Bagian Materi dan Komunikasi Pimpinan",
      "Kepala Sub Bagian Tata Usaha",
    ],
  },
  status: {
    type: String,
    required: false,
    enum: ["active", "inactive"],
  },
  registrationDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const User = mongoose.model("User", user);
module.exports = User;
