import { NextFunction, Request, Response } from "express";
import {
  createLike,
  deleteLike,
  getLike,
  getLikes,
  updateLike,
} from "../services/like.service";
import { CreateLikeInput, UpdateLikeInput } from "../schemas/like.schema";
import AppError from "../utils/appError";
import { deletePost } from "../services/post.service";

export const createLikeHandler = async (
  req: Request<{}, CreateLikeInput>,
  res: Response,
  next: NextFunction
) => {
  const { postId, commentId, ...rest } = req.body;
  const likeConnection = postId
    ? {
        posts: {
          connect: {
            id: postId,
          },
        },
      }
    : {
        comments: {
          connect: {
            id: commentId,
          },
        },
      };
  try {
    const like = await createLike({
      ...rest,
      author: {
        connect: {
          id: res.locals.user.id,
        },
      },
      ...likeConnection,
    });

    res.status(201).json({
      status: "success",
      data: {
        like,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const updateLikeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const like = await getLike({
      id: req.params.likeId,
      /*AND: {
        authorId: { equals: res.locals.user.id },
        postId: { equals: req.body.postId },
      },*/
    });

    if (!like) {
      return next(new AppError(404, "Like not found"));
    }

    const updatedLike = await updateLike(
      {
        id: like.id,
      },
      req.body
    );

    res.status(200).json({
      status: "success",
      data: {
        updatedLike,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

const getLikesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const likes = await getLikes();
  } catch (err: any) {
    next(err);
  }
};

export const deleteLikeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const like = await getLike({
      id: req.params.likeId,
      /*AND: {
        authorId: { equals: res.locals.user.id },
        postId: { equals: req.params.postId },
        commentId: { equals: req.params.commentId },
      },*/
    });

    if (!like) {
      return next(new AppError(404, "Like not found"));
    }

    await deleteLike({ id: like.id });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};
