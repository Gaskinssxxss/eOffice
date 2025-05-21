const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const arsipSchema = new Schema({
  idSurat: {
    type: Schema.Types.ObjectId,
    ref: "SuratSchema",
    required: true,
  },
  Status: {
    type: String,
    required: false,
    default: "diarsipkan",
  },
  archivedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const ArsipSchema = mongoose.model("ArsipSchema", arsipSchema);
module.exports = ArsipSchema;
