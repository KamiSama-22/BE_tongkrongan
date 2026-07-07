import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
    const ext = path.extname(file.originalname);

    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + ext
    );
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  cb
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("File harus berupa gambar"));
  }
};

export default multer({
  storage,
  fileFilter,
});