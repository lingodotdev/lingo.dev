import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from "@/constants";
import ApiError from "@/utils/ApiError";
import { FileType } from "@/types/file.type";

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
  if (!ACCEPTED_FILE_TYPES.includes(file.mimetype as FileType)) {
    cb(
      new ApiError(400, "Unsupported file type", undefined, [
        `Accepted file types: ${ACCEPTED_FILE_TYPES.join(", ")}`,
      ]),
    );
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

export default upload;
