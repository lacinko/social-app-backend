import { NextFunction, Request, Response } from "express";
import { createComment, getComments } from "../services/comment.service";
import { getPost } from "../services/post.service";
import AppError from "../utils/appError";
import {
  GenericObject,
  createObjectFromURLParamsAttributes,
} from "../utils/utilsFunctions";
import { Prisma } from "@prisma/client";

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
