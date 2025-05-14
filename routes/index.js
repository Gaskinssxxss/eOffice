const { Router } = require("express");
const User = require("../model/user");
const Surat = require("../model/surat");
const ArsipSurat = require("../model/arsipSurat");
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
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

const createJwt = (payload) => {
  return jwt.sign({ payload }, SECRET, { expiresIn: MAX_AGE });
};

/**
 * @route POST api/surat
 * @desc Create new surat
 * @access Private
 */
router.post("/surat", requireLogin, upload.array("lampiran", 5), (req, res) => {
  const {
    nomorSurat,
    perihal,
    pengirim,
    penerima,
    status,
    isiTidakLanjut,
    tanggalTindakLanjut,
    keterangan,
  } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded." });
  }

  const lampiran = req.files.map((file) => file.path);

  Surat.create({
    nomorSurat,
    lampiran,
    perihal,
    pengirim,
    penerima,
    status,
    isiTidakLanjut,
    tanggalTindakLanjut,
    keterangan,
  })
    .then(() => {
      return res.status(200).json({ message: "success" });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ message: "failed", error });
    });
});

router.put(
  "/surat/:id/signature-replace",
  requireLogin,
  upload.single("signature"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { originalPath } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "No signature file uploaded." });
      }

      const surat = await Surat.findById(id);
      if (!surat) {
        return res.status(404).json({ message: "Surat not found." });
      }

      const newLampiran = surat.lampiran.map((p) =>
        p === originalPath ? req.file.path : p
      );

      const updated = await Surat.findByIdAndUpdate(
        id,
        {
          $set: {
            lampiran: newLampiran,
            status: "ditandatangani",
          },
        },
        { new: true }
      );

      return res.status(200).json({ message: "success", data: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "failed", error: err });
    }
  }
);

/**
 * @route GET api/surat
 * @desc Get all surat
 * @access Private
 */
router.get("/surat", requireLogin, (req, res) => {
  Surat.find()
    .then((surats) => {
      return res.status(200).json({ message: "success", data: surats });
    })
    .catch((err) => {
      return res.status(400).json({ message: "failed", err });
    });
});

/**
 * @route GET api/surat/:id
 * @desc Get a specific surat
 * @access Private (only accessible by pengirim or penerima)
 */
router.get("/surat/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

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
 * @route PUT api/surat/:id
 * @desc Update surat
 * @access Private
 */
router.put(
  "/surat/:id",
  requireLogin,
  upload.array("newFiles", 5),
  (req, res) => {
    const { id } = req.params;
    let lampiran = [];
    if (req.body.existingPaths) {
      try {
        lampiran = JSON.parse(req.body.existingPaths);
      } catch {
        res.status(404);
      }
    }

    if (req.files && req.files.length) {
      const newPaths = req.files.map((f) => f.path);
      lampiran = lampiran.concat(newPaths);
    }
    const updateData = {
      nomorSurat: req.body.nomorSurat,
      perihal: req.body.perihal,
      pengirim: req.body.pengirim,
      penerima: req.body.penerima,
      status: req.body.status,
      isiTidakLanjut: req.body.isiTidakLanjut,
      keterangan: req.body.keterangan,
      lampiran,
    };

    Surat.findByIdAndUpdate(id, updateData, { new: true })
      .then((u) => res.status(200).json({ message: "success", data: u }))
      .catch((err) => res.status(400).json({ message: "failed", err }));
  }
);

// router.put(
//   "/surat/:id",
//   requireLogin,
//   upload.array("lampiran", 5),
//   (req, res) => {
//     const { id } = req.params;
//     const {
//       nomorSurat,
//       perihal,
//       pengirim,
//       penerima,
//       status,
//       isiTidakLanjut,
//       tanggalTindakLanjut,
//       keterangan,
//     } = req.body;

//     const lampiran =
//       req.files && req.files.length > 0
//         ? req.files.map((file) => file.path)
//         : undefined;

//     const updateData = {
//       nomorSurat,
//       perihal,
//       pengirim,
//       penerima,
//       status,
//       isiTidakLanjut,
//       tanggalTindakLanjut,
//       keterangan,
//     };

//     if (lampiran) {
//       updateData.lampiran = lampiran;
//     }

//     Surat.findByIdAndUpdate(id, updateData, { new: true })
//       .then((updatedSurat) => {
//         return res.status(200).json({ message: "success", data: updatedSurat });
//       })
//       .catch((err) => {
//         return res.status(400).json({ message: "failed", err });
//       });
//   }
// );

/**
 * @route PUT api/surat/:id/status
 * @desc Update status of surat
 * @access Private
 */
router.put("/surat/:id/status", requireLogin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "dikirim",
    "diterima",
    "dibaca",
    "ditandatangani",
    "ditolak",
    "revisi",
    "direvisi",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "failed", error: "invalid-status" });
  }

  Surat.findByIdAndUpdate(id, { status: status }, { new: true })
    .then((updatedSurat) => {
      if (!updatedSurat) {
        return res
          .status(404)
          .json({ message: "failed", error: "surat-not-found" });
      }
      return res.status(200).json({ message: "success", data: updatedSurat });
    })
    .catch((err) => {
      return res.status(400).json({ message: "failed", err });
    });
});

router.put("/surat/:id/keterangan", requireLogin, (req, res) => {
  const { id } = req.params;
  const { keterangan } = req.body;
  const { status } = req.body;

  Surat.findByIdAndUpdate(id, { keterangan, status }, { new: true })
    .then((updatedSurat) => {
      return res.status(200).json({ message: "success", data: updatedSurat });
    })
    .catch((err) => {
      return res.status(400).json({ message: "failed", err });
    });
});

/**
 * @route DELETE api/surat/:id
 * @desc Delete surat
 * @access Private
 */
router.delete("/surat/:id", requireLogin, (req, res) => {
  const { id } = req.params;

  Surat.findByIdAndDelete(id)
    .then(() => {
      return res
        .status(200)
        .json({ message: "success", message: "Surat deleted" });
    })
    .catch((err) => {
      return res.status(400).json({ message: "failed", err });
    });
});

/**
 * @route POST api/arsipsurat
 * @desc Create new arsip surat
 * @access Private
 */
router.post("/arsipsurat", requireLogin, (req, res) => {
  const {
    idSurat,
    nomorSurat,
    lampiran,
    perihal,
    status,
    penindakLanjut,
    tujuanTindakLanjut,
    isiTidakLanjut,
    tanggalTindakLanjut,
    keterangan,
  } = req.body;

  ArsipSurat.create({
    idSurat,
    nomorSurat,
    lampiran,
    perihal,
    status,
    penindakLanjut,
    tujuanTindakLanjut,
    isiTidakLanjut,
    tanggalTindakLanjut,
    keterangan,
  })
    .then(() => {
      return res.status(200).json({ message: "success" });
    })
    .catch((error) => {
      console.log(error);
      return res.status(400).json({ message: "failed", error });
    });
});

/**
 * @route GET api/arsipsurat
 * @desc Get all arsip surat
 * @access Private
 */
router.get("/arsipsurat", requireLogin, (req, res) => {
  ArsipSurat.find()
    .then((arsipsurats) => {
      return res.status(200).json({ message: "success", data: arsipsurats });
    })
    .catch((err) => {
      return res.status(400).json({ message: "failed", err });
    });
});

/**
 * @route GET api/arsipsurat/:id
 * @desc Get a specific arsip surat
 * @access Private
 */
router.get("/arsipsurat/:id", requireLogin, (req, res) => {
  const { id } = req.params;

  ArsipSurat.findById(id)
    .then((arsipsurat) => {
      if (!arsipsurat) {
        return res.status(404).json({ message: "arsip surat not found" });
      }
      return res.status(200).json({ message: "success", data: arsipsurat });
    })
    .catch((err) => {
      return res.status(400).json({ message: "failed", err });
    });
});

/**
 * @route PUT api/arsipsurat/:id
 * @desc Update arsip surat
 * @access Private
 */
router.put("/arsipsurat/:id", requireLogin, (req, res) => {
  const { id } = req.params;
  const {
    idSurat,
    nomorSurat,
    lampiran,
    perihal,
    status,
    penindakLanjut,
    tujuanTindakLanjut,
    isiTidakLanjut,
    tanggalTindakLanjut,
    keterangan,
  } = req.body;

  const updateData = {
    idSurat,
    nomorSurat,
    lampiran,
    perihal,
    status,
    penindakLanjut,
    tujuanTindakLanjut,
    isiTidakLanjut,
    tanggalTindakLanjut,
    keterangan,
  };

  ArsipSurat.findByIdAndUpdate(id, updateData, { new: true })
    .then((updatedArsipSurat) => {
      return res
        .status(200)
        .json({ message: "success", data: updatedArsipSurat });
    })
    .catch((err) => {
      return res.status(400).json({ message: "failed", err });
    });
});

/**
 * @route DELETE api/arsipsurat/:id
 * @desc Delete arsip surat
 * @access Private
 */
router.delete("/arsipsurat/:id", requireLogin, (req, res) => {
  const { id } = req.params;

  ArsipSurat.findByIdAndDelete(id)
    .then(() => {
      return res
        .status(200)
        .json({ message: "success", message: "Arsip surat deleted" });
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

      const maxAge = 3 * 24 * 60 * 60;
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
router.delete("/users/status/:status", requireLogin, (req, res) => {
  const { status } = req.params;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "failed", error: "invalid-status" });
  }

  User.deleteMany({ status })
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
