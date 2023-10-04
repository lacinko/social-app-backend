import { Like, Prisma } from "@prisma/client";
import prisma from "../utils/connectPrisma";
import { GetLikeInput } from "../schemas/like.schema";

export const createLike = async (input: Prisma.LikeCreateInput) => {
  return (await prisma.like.create({
    data: input,
  })) as Like;
};

export const getLike = async (
  where: Prisma.LikeWhereInput,
  select?: Prisma.LikeSelect,
  include?: Prisma.LikeInclude
) => {
  return (await prisma.like.findFirst({
    where,
    ...(!select && include && { include }),
    ...(!include && select && { select }),
  })) as Like;
};

export const updateLike = async (
  where: Prisma.LikeWhereUniqueInput,
  input: Prisma.LikeUpdateInput,
  select?: Prisma.LikeSelect,
  include?: Prisma.LikeInclude
) => {
  return (await prisma.like.update({
    where,
    data: input,
    ...(!select && include && { include }),
    ...(!include && select && { select }),
  })) as Like;
};

export const getLikes = async (
  where?: Prisma.LikeScalarWhereWithAggregatesInput,
  select?: Prisma.LikeSelect,
  include?: Prisma.LikeInclude
) => {
  return (await prisma.like.findMany({
    ...(!where && { where }),
    ...(!select && include && { include }),
    ...(!include && select && { select }),
  })) as Like[];
};

export const aggregateLikes = async (
  where: Prisma.LikeWhereInput,
  by: Prisma.LikeScalarFieldEnum[],
  count: Prisma.LikeCountAggregateInputType | true
) => {
  return await prisma.like.groupBy({
    by: by,
    where: where,
    _count: count,
  });
};

export const deleteLike = async (
  where: Prisma.LikeWhereUniqueInput,
  select?: Prisma.LikeSelect
) => {
  return await prisma.like.delete({
    where,
    select,
  });
};
