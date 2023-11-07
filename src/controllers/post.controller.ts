import { NextFunction, Request, Response } from "express";
import {
  CreatePostInput,
  DeletePostInput,
  GetPostInput,
  GetPostsByCollectionIdInput,
  UpdatePostInput,
} from "../schemas/post.schema";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getPostsByCollectionId,
  updatePost,
} from "../services/post.service";
import AppError from "../utils/appError";
import {
  GenericObject,
  createObjectFromURLParamsAttributes,
} from "../utils/utilsFunctions";
import { Prisma } from "@prisma/client";

export const createPostHandler = async (
  req: Request<CreatePostInput>,
  res: Response,
  next: NextFunction
) => {
  const { collectionId, images, ...rest } = req.body;
  //TODO TIDY UP CODE
  const postImages =
    images?.map((img) => {
      return {
        url: img,
      };
    }) || [];
  try {
    const post = await createPost({
      ...rest,
      images: {
        createMany: {
          data: postImages,
        },
      },
      author: { connect: { id: res.locals.user.id } },
      collection: { connect: { id: collectionId } },
    });

    res.status(201).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        status: "fail",
        message: "Post with that title already exist",
      });
    }
    next(err);
  }
};

export const getPostHandler = async (
  req: Request<GetPostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { select, include } = createObjectFromURLParamsAttributes(
      req.query as GenericObject
    );

    const post = await getPost(
      { id: req.params.postId },
      select as Prisma.PostSelect,
      include as Prisma.PostInclude
    );

    /*
    const likes = await aggregateLikes(
      {
        postId: post.id,
      },
      ["isPositive"],
      true
    );
    */
    /*
    const likes = (post.likes as Like[]).filter(
      (like) => like.isPositive
    ).length;

    const dislikes = (post.likes as Like[]).filter(
      (like) => !like.isPositive
    ).length;

    const comments = (post.comments as Comment[]).length;
    */

    if (!post) {
      return next(new AppError(404, "Post not found"));
    }

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getPostsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { where, select, include } = createObjectFromURLParamsAttributes(
      req.query as GenericObject
    );

    const posts = await getPosts(
      where as Prisma.PostWhereInput,
      select as Prisma.PostSelect,
      include as Prisma.PostInclude
    );

    if (!posts) {
      return next(new AppError(404, "Posts not found"));
    }

    res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getPostsByCollectionIdHandler = async (
  req: Request<GetPostsByCollectionIdInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { select, include } = createObjectFromURLParamsAttributes(
      req.query as GenericObject
    );

    const posts = await getPostsByCollectionId(
      req.params.collectionId,
      select as Prisma.PostSelect,
      include as Prisma.PostInclude
    );

    if (!posts) {
      return next(new AppError(404, "Posts not found"));
    }

    res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updatePostHandler = async (
  req: Request<UpdatePostInput["params"], {}, UpdatePostInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPost({ id: req.params.postId });

    if (!post) {
      return next(new AppError(404, "Post with that ID not found"));
    }

    const updatedPost = await updatePost({ id: req.params.postId }, req.body);

    res.status(200).json({
      status: "success",
      data: {
        updatedPost,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deletePostHandler = async (
  req: Request<DeletePostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPost({ id: req.params.postId });

    if (!post) {
      return next(new AppError(404, "Post with that ID not found"));
    }

    await deletePost({ id: req.params.postId });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};
