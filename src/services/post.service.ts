import { Post, Prisma, PrismaClient } from '@prisma/client'
import { CreatePostInput, UpdatePostInput } from '../schemas/post.schema'

const prisma = new PrismaClient()

export const createPost = async (input: Prisma.PostCreateInput) => {
  return (await prisma.post.create({
    data: input,
  })) as Post
}

export const getPost = async (
  where: Prisma.PostWhereInput,
  select?: Prisma.PostSelect
) => {
  return (await prisma.post.findFirst({
    where,
    select,
  })) as Post
}

export const findPosts = async () => {
  return await prisma.post.findMany()
}

export const updatePost = async (
  where: Prisma.PostWhereUniqueInput,
  data: Prisma.PostUpdateInput,
  select?: Prisma.PostSelect
) => {
  return (await prisma.post.update({
    where,
    data,
    select,
  })) as Post
}

export const deletePost = async (
  where: Prisma.PostWhereUniqueInput,
  select?: Prisma.PostSelect
) => {
  return await prisma.post.delete({ where, select })
}
