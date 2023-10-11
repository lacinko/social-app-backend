import { Comment, Prisma } from "@prisma/client";
import prisma from "../utils/connectPrisma";

export const createComment = async (input: Prisma.CommentCreateInput) => {
  return (await prisma.comment.create({
    data: input,
  })) as Comment;
};

export const getComment = async (
  where: Prisma.CommentWhereUniqueInput,
  select?: Prisma.CommentSelect,
  include?: Prisma.CommentInclude
) => {
  return (await prisma.comment.findUnique({
    where,
    ...(!select && include && { include }),
    ...(!include && select && { select }),
  })) as Comment;
};

export const getComments = async (
  where: Prisma.CommentWhereInput,
  select?: Prisma.CommentSelect,
  include?: Prisma.CommentInclude
) => {
  return await prisma.comment.findMany({
    where,
    ...(!select && include && { include }),
    ...(!include && select && { select }),
  });
};

export const deleteComment = async (
  where: Prisma.CommentWhereUniqueInput,
  select?: Prisma.CommentSelect
) => {
  return await prisma.comment.delete({
    where,
    select,
  });
};

export const updateComment = async (
  where: Prisma.CommentWhereUniqueInput,
  input: Prisma.CommentUpdateInput,
  select?: Prisma.CommentSelect,
  include?: Prisma.CommentInclude
) => {
  return await prisma.comment.update({
    where,
    data: input,
    ...(!select && include && { include }),
    ...(!include && select && { select }),
  });
};
