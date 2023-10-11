import { Post, Prisma, PrismaClient } from "@prisma/client";
import { CreatePostInput, UpdatePostInput } from "../schemas/post.schema";
import prisma from "../utils/connectPrisma";

export const createPost = async (input: Prisma.PostCreateInput) => {
  return (await prisma.post.create({
    data: input,
  })) as Post;
};

export const getPost = async (
  where: Prisma.PostWhereInput,
  select?: Prisma.PostSelect,
  include?: Prisma.PostInclude
) => {
  return (await prisma.post.findFirst({
    where,
    ...(!select && include && { include }),
    ...(!include && select && { select }),
  })) as Post & Prisma.PostInclude;
};

export const getPosts = async (
  where?: Prisma.PostWhereInput,
  select?: Prisma.PostSelect,
  include?: Prisma.PostInclude
) => {
  return await prisma.post.findMany({
    ...(where && { where }),
    ...(!select && include && { include }),
    ...(!include && select && { select }),
  });
};

export const getPostsByCollectionId = async (
  collectionId: string,
  select?: Prisma.PostSelect,
  include?: Prisma.PostInclude
) => {
  return await prisma.post.findMany({
    where: {
      collectionId,
    },
    ...(!select && include && { include }),
    ...(!include && select && { select }),
  });
};

export const updatePost = async (
  where: Prisma.PostWhereUniqueInput,
  data: Prisma.PostUpdateInput,
  select?: Prisma.PostSelect
) => {
  return (await prisma.post.update({
    where,
    data,
    select,
  })) as Post;
};

export const deletePost = async (
  where: Prisma.PostWhereUniqueInput,
  select?: Prisma.PostSelect
) => {
  return await prisma.post.delete({ where, select });
};
