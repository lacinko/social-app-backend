import { Collection, Prisma } from "@prisma/client";
import prisma from "../utils/connectPrisma";

export const createCollection = async (
  input: Prisma.CollectionCreateInput,
  include?: Prisma.CollectionInclude
) => {
  return (await prisma.collection.create({
    data: input,
    include: include,
  })) as Collection;
};

export const updateCollection = async (
  where: Prisma.CollectionWhereUniqueInput,
  data: Prisma.CollectionUpdateInput,
  select?: Prisma.CollectionSelect
) => {
  return (await prisma.collection.update({
    where,
    data,
    select,
  })) as Collection;
};

export const getCollection = async (
  where: Prisma.CollectionWhereUniqueInput,
  select?: Prisma.CollectionSelect,
  include?: Prisma.CollectionInclude
) => {
  return (await prisma.collection.findUnique({
    where,
    ...(!select && include && { include }),
    ...(!include && select && { select }),
  })) as Collection;
};

export const getCollections = async () => {
  return await prisma.collection.findMany();
};

export const deleteCollection = async (
  where: Prisma.CollectionWhereUniqueInput,
  select?: Prisma.CollectionSelect
) => {
  return (await prisma.collection.delete({ where, select })) as Collection;
};
