import { NextFunction, Request, Response } from 'express'
import {
  CreatePostInput,
  DeletePostInput,
  GetPostInput,
  UpdatePostInput,
} from '../schemas/post.schema'
import {
  createPost,
  deletePost,
  findPosts,
  getPost,
  updatePost,
} from '../services/post.service'
import AppError from '../utils/appError'

export const createPostHandler = async (
  req: Request<CreatePostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await createPost({
      ...req.body,
      user: { connect: { id: res.locals.user.id } },
    })

    res.status(201).json({
      status: 'success',
      data: {
        post,
      },
    })
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'Post with that title already exist',
      })
    }
    next(err)
  }
}

export const getPostHandler = async (
  req: Request<GetPostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPost({ id: req.params.postId })

    if (!post) {
      return next(new AppError(404, 'Post not found'))
    }

    res.status(200).json({
      status: 'success',
      data: {
        post,
      },
    })
  } catch (err: any) {
    next(err)
  }
}

export const getPostsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const posts = await findPosts()

    if (!posts) {
      return next(new AppError(404, 'Posts not found'))
    }

    res.status(200).json({
      status: 'success',
      data: {
        posts,
      },
    })
  } catch (err: any) {
    next(err)
  }
}

export const updatePostHandler = async (
  req: Request<UpdatePostInput['params'], {}, UpdatePostInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPost({ id: req.params.postId })

    if (!post) {
      return next(new AppError(404, 'Post with that ID not found'))
    }

    const updatedPost = await updatePost({ id: req.params.postId }, req.body)

    res.status(200).json({
      status: 'success',
      data: {
        updatedPost,
      },
    })
  } catch (err: any) {
    next(err)
  }
}

export const deletePostHandler = async (
  req: Request<DeletePostInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const post = await getPost({ id: req.params.postId })

    if (!post) {
      return next(new AppError(404, 'Post with that ID not found'))
    }

    await deletePost({ id: req.params.postId })

    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (err: any) {
    next(err)
  }
}
