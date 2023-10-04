import { Comment, Prisma } from "@prisma/client";
import prisma from "../utils/connectPrisma";

export const createComment = async (input: Prisma.CommentCreateInput) => {
  return (await prisma.comment.create({
    data: input,
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
