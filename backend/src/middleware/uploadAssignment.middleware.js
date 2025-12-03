import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/assignments/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const uploadAssignment = multer({ storage });
  