import type { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import ApiError from "./ApiError";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const handleErrorResponse = (err: Error | ApiError | MulterError): ApiError => {
  // Multer file upload errors
  if (err instanceof MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return new ApiError(400, "File size should not exceed 5MB.");
      case "LIMIT_UNEXPECTED_FILE":
        return new ApiError(400, "Too many files uploaded.");
      default:
        return new ApiError(400, err.message || "File upload error");
    }
  }

  // EJS template rendering errors
  if (err.name === "EJSError" || err.message?.includes("ejs:") || err.message?.includes("Could not find matching close tag")) {
    return new ApiError(
      500,
      process.env.NODE_ENV === "development"
        ? `Template rendering error: ${err.message}`
        : "Error rendering page",
      err.stack,
    );
  }

  // Default ApiError
  if (err instanceof ApiError) {
    return err;
  }

  // Unknown Error
  return new ApiError(500, "Internal Server Error", err.stack);
};

const asyncHandler =
  (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(
      (err: Error | ApiError | MulterError) => {
        const errorResponse = handleErrorResponse(err);

        if (process.env.NODE_ENV === "development") {
          console.error(`🔴 ${errorResponse.getTraceStack()}
        ====================================================
        statusCode: ${errorResponse.statusCode}
        `);
        }

        next(errorResponse);
      },
    );
  };

export default asyncHandler;
