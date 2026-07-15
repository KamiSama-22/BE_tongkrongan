import multer from "multer";

// Simpan file sementara di folder 'uploads'
const upload = multer({ dest: 'uploads/' });

export default upload;