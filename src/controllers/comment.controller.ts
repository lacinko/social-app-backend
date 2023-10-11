import { NextFunction, Request, Response } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  getComment,
  updateComment,
} from "../services/comment.service";
import AppError from "../utils/appError";
import {
  GenericObject,
  createObjectFromURLParamsAttributes,
} from "../utils/utilsFunctions";
import { Prisma } from "@prisma/client";
import { DeleteCommentInput } from "../schemas/comment.schema";

export const createCommentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { postId, parentId, content } = req.body;
  try {
    const comment = await createComment({
      content,
      ...(parentId && { parent: { connect: { id: parentId } } }),
      author: { connect: { id: res.locals.user.id } },
      ...(postId && { post: { connect: { id: postId } } }),
    });

    res.status(201).json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getCommentsForPostHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { select, include } = createObjectFromURLParamsAttributes(
      req.query as GenericObject
    );

    const { postId, parentId } = req.params;

    const comments = await getComments(
      {
        parentId: parentId === "null" ? null : parentId,
        postId: postId === "undefined" ? undefined : postId,
        /*
        AND: [
          { parentId: parentId === "undefined" ? null : parentId },
          { postId: postId === "undefined" ? undefined : postId },
        ],
        */
      },
      select as Prisma.PostSelect,
      include as Prisma.PostInclude
    );

    if (!comments) {
      throw new AppError(404, "Comments not found");
    }

    res.status(200).json({
      status: "success",
      data: {
        comments,
      },
    });

    //const comments
  } catch (err: any) {
    next(err);
  }
};

export const deleteCommentHandler = async (
  req: Request<DeleteCommentInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await getComment({
      id: req.params.commentId,
    });

    if (!comment) {
      return next(new AppError(404, "Comment not found"));
    }

    await deleteComment({
      id: comment.id,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateCommentHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const comment = await getComment({ id: req.params.commentId });

    if (!comment) {
      return next(new AppError(404, "Comment not found"));
    }

    const updatedComment = await updateComment(
      {
        id: comment.id,
      },
      req.body
    );

    res.status(200).json({
      status: "success",
      data: {
        updatedComment,
      },
    });
  } catch (err) {
    next(err);
  }
};
