import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message);

  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
  });
};