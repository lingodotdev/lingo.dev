import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const storage = multer.diskStorage({
  destination: function (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    cb(null, "uploads/");
  },
  filename: function (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = function (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) {
  if (file.mimetype !== "application/pdf") {
    cb(new Error("Only PDF files are allowed!"));
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
