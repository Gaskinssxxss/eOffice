const { Router } = require("express");
const User = require("../model/user");
const SuratSchema = require("../model/suratSchema");
const ArsipSchema = require("../model/arsipSchema");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { SECRET, MAX_AGE } = require("../consts");
const { requireLogin } = require("../middleware/authentication");

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const timestamp = Date.now();
    cb(null, `${nameWithoutExt}-${timestamp}${ext}`);
  },
});

const upload = multer({ storage: storage });

const createJwt = (payload) => {
  return jwt.sign({ payload }, SECRET, { expiresIn: MAX_AGE });
};

router.get("/hide/arsip", requireLogin, async (req, res) => {
  try {
    const arsipList = await ArsipSchema.find().populate("idSurat");
    return res.status(200).json({ message: "success", data: arsipList });
  } catch (err) {
    return res.status(400).json({ message: "failed", error: err.message });
  }
});

router.get("/hide/arsip/:id", requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const arsip = await ArsipSchema.findById(id).populate("idSurat");
    if (!arsip) {
      return res.status(404).json({ message: "Arsip not found" });
    }
    return res.status(200).json({ message: "success", data: arsip });
  } catch (err) {
    return res.status(400).json({ message: "failed", error: err.message });
  }
});

router.post("/hide/arsip", requireLogin, async (req, res) => {
  try {
    const { idSurat, Status } = req.body;

    const surat = await SuratSchema.findById(idSurat);
    if (!surat) {
      return res
        .status(404)
        .json({ message: "Surat not found, cannot archive" });
    }

    const newArsip = new ArsipSchema({
      idSurat,
      Status: Status || "diarsipkan",
      archivedAt: Date.now(),
    });

    const savedArsip = await newArsip.save();

    await savedArsip.populate("idSurat");

    return res.status(201).json({ message: "Arsip created", data: savedArsip });
  } catch (err) {
    return res.status(400).json({ message: "failed", error: err.message });
  }
});

router.post(
  "/hide/surat",
  requireLogin,
  upload.fields([
    { name: "lampiran", maxCount: 10 },
    { name: "parafLembarDisposisi", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        surat_dari,
        noSurat,
        tglSurat,
        diterimaTgl,
        noAgenda,
        sifatSurat,
        diteruskanKepada,
        disposisi,
        catatan,
        tglParafLembarDisposisi,
        statusLampiran,
      } = req.body;

      const lampiranFiles = req.files["lampiran"] || [];
      const parafFile = req.files["parafLembarDisposisi"]
        ? req.files["parafLembarDisposisi"][0].filename
        : null;

      const lampiran = lampiranFiles.map((file) => file.filename);
      const statusSurat = "dikirim";

      const newSurat = new SuratSchema({
        surat_dari,
        noSurat,
        tglSurat,
        diterimaTgl,
        noAgenda,
        sifatSurat,
        diteruskanKepada: Array.isArray(diteruskanKepada)
          ? diteruskanKepada
          : [diteruskanKepada],
        disposisi: Array.isArray(disposisi) ? disposisi : [disposisi],
        catatan,
        parafLembarDisposisi: parafFile,
        tglParafLembarDisposisi,
        lampiran,
        statusSurat,
        statusLampiran,
      });

      const savedSurat = await newSurat.save();
      return res
        .status(201)
        .json({ message: "Surat created", data: savedSurat });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "failed", error: err.message });
    }
  }
);

router.get("/hide/surat", requireLogin, async (req, res) => {
  try {
    const suratList = await SuratSchema.find();
    return res.status(200).json({ message: "success", data: suratList });
  } catch (err) {
    return res.status(400).json({ message: "failed", error: err.message });
  }
});

router.get("/hide/surat/:id", requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const surat = await SuratSchema.findById(id);
    if (!surat) {
      return res.status(404).json({ message: "Surat not found" });
    }
    return res.status(200).json({ message: "success", data: surat });
  } catch (err) {
    return res.status(400).json({ message: "failed", error: err.message });
  }
});

router.put(
  "/hide/surat/:id",
  requireLogin,
  upload.fields([
    { name: "lampiran", maxCount: 10 },
    { name: "parafLembarDisposisi", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body };

      if (req.files["lampiran"]) {
        updateData.lampiran = req.files["lampiran"].map((f) => f.filename);
      }
      if (req.files["parafLembarDisposisi"]) {
        updateData.parafLembarDisposisi =
          req.files["parafLembarDisposisi"][0].filename;
      }

      if (
        updateData.diteruskanKepada &&
        typeof updateData.diteruskanKepada === "string"
      ) {
        updateData.diteruskanKepada = [updateData.diteruskanKepada];
      }
      if (updateData.disposisi && typeof updateData.disposisi === "string") {
        updateData.disposisi = [updateData.disposisi];
      }

      const updatedSurat = await SuratSchema.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!updatedSurat) {
        return res.status(404).json({ message: "Surat not found" });
      }
      return res
        .status(200)
        .json({ message: "Surat updated", data: updatedSurat });
    } catch (err) {
      return res.status(400).json({ message: "failed", error: err.message });
    }
  }
);

router.delete("/hide/surat/:id", requireLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SuratSchema.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Surat not found" });
    }
    return res.status(200).json({ message: "Surat deleted" });
  } catch (err) {
    return res.status(400).json({ message: "failed", error: err.message });
  }
});

/**
 * @route GET api/users/status/:status
 * @desc Get all users by status
 * @access Private (admin only)
 */
router.get("/users/all", requireLogin, (req, res) => {
  User.find()
    .then((users) => {
      return res.status(200).json({ message: "success", data: users });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "failed", error: err });
    });
});

/**
 * @route GET api/surat/:id
 * @desc Get a specific surat (only accessible by pengirim or penerima)
 * @access Private (only accessible by pengirim or penerima)
 */
router.get("/surat/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  const userId = req.user.username;

  Surat.findById(id)
    .then((surat) => {
      if (!surat) {
        return res.status(404).json({ message: "surat not found" });
      }

      if (surat.pengirim !== userId && surat.penerima !== userId) {
        return res.status(403).json({
          message:
            "Access denied. You are neither the sender nor the receiver.",
        });
      }

      return res.status(200).json({ message: "success", data: surat });
    })
    .catch((err) => {
      return res.status(400).json({ message: "failed", err });
    });
});

/**
 * @route GET api/users/status/:status
 * @desc Get all users by status
 * @access Private (admin only)
 */
router.get("/users/status/:status", requireLogin, (req, res) => {
  const { status } = req.params;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "failed", error: "invalid-status" });
  }
  User.find({ status })
    .then((users) => {
      return res.status(200).json({ message: "success", data: users });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "failed", error: err });
    });
});

/**
 * @route POST api/users/register
 * @desc Register new user
 * @access Private (admin only)
 */
router.post("/users/register", (req, res) => {
  const { username, email, password, role, jabatan } = req.body;
  User.create({ username, email, password, role, jabatan, status: "inactive" })
    .then(() => {
      return res.status(200).json({ message: "success" });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ message: "failed", error });
    });
});

/**
 * @route POST api/users/login
 * @desc Login user
 * @access Public
 */
router.post("/users/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email, password: password })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "failed", error: "wrong-credentials" });
      }
      if (user.status === "inactive") {
        return res
          .status(403)
          .json({ message: "failed", error: "account-inactive" });
      }

      const maxAge = 10 * 24 * 60 * 60;
      const token = createJwt({
        _id: user._id,
        role: user.role,
        jabatan: user.jabatan,
      });

      res.cookie("auth", token, { httpOnly: true, maxAge: maxAge * 10 });
      return res.status(200).json({ message: "success", data: user });
    })
    .catch((err) => {
      return res.status(400).json({ message: "failed", err });
    });
});

/**
 * @route POST api/users/logout
 * @desc Log user out
 * @access Public
 */
router.post("/users/logout", (req, res) => {
  res.clearCookie("auth");
  return res.status(200).json({ message: "success" });
});

/**
 * @route GET api/users
 * @desc Get authenticated user
 * @access Private
 */
router.get("/users", requireLogin, (req, res) => {
  const token = req.cookies.auth;
  const decodedToken = jwt.verify(token, SECRET);
  const _id = decodedToken.payload._id;

  User.findOne(
    { _id },
    {
      username: 1,
      email: 1,
      role: 1,
      jabatan: 1,
      registrationDate: 1,
      status: 1,
    }
  )
    .then((user) => {
      return res.status(200).json({ message: "success", data: user });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(401)
        .json({ message: "error", code: "unauthenticated-access" });
    });
});

/**
 * @route PUT api/users/:id/status
 * @desc Update user status
 * @access Private (admin only)
 */
router.put("/users/:id/status", requireLogin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "failed", error: "invalid-status" });
  }

  User.findByIdAndUpdate(id, { status }, { new: true })
    .then((updatedUser) => {
      return res.status(200).json({ message: "success", data: updatedUser });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "failed", error: err });
    });
});

/**
 * @route DELETE api/users/status/:status
 * @desc Delete users by status
 * @access Private (admin only)
 */
router.delete("/users/:id", requireLogin, (req, res) => {
  const { id } = req.body;

  User.deleteOne({ id })
    .then(() => {
      return res
        .status(200)
        .json({ message: "success", message: "Users deleted" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({ message: "failed", error: err });
    });
});

module.exports = router;
