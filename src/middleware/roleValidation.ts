import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";

export const roleValidation =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!allowedRoles.includes(user.role)) {
      return next(
        new AppError(403, "You are not allowed to perform this action")
      );
    }
    next();
  };
