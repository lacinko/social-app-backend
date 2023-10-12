import { NextFunction, Request, Response } from "express";
import { findUniqueUser, updateUser } from "../services/user.service";
import AppError from "../utils/appError";

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    res.status(200).status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUniqueUser({ id: res.locals.user });

    if (!user) {
      return next(new AppError(404, "User not found"));
    }

    const updatedUser = await updateUser(
      {
        id: user.id,
      },
      {
        name: req.body.name,
        photo: req.body.image,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  } catch (err: any) {
    next(err);
  }
};
