import { NextFunction, Request, Response } from "express";
import {
  CreateCollectionInput,
  DeleteCollectionInput,
  GetCollectionInput,
  UpdateCollectionInput,
} from "../schemas/collection.schema";
import {
  createCollection,
  deleteCollection,
  getCollection,
  getCollectionAccount,
  getCollections,
  getCollectionsAccounts,
  joinCollection,
  leaveCollection,
  updateCollection,
} from "../services/collection.service";
import AppError from "../utils/appError";
import {
  GenericObject,
  createObjectFromURLParamsAttributes,
} from "../utils/utilsFunctions";
import { Prisma } from "@prisma/client";

export const createCollectionHandler = async (
  req: Request<{}, {}, CreateCollectionInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accountRole, ...collectionBody } = Object.assign({}, req.body);

    const collection = await createCollection(
      {
        ...collectionBody,
        members: {
          create: {
            role: accountRole,
            user: {
              connect: {
                id: res.locals.user.id,
              },
            },
          },
        },
      },
      {
        members: true,
      }
    );

    res.status(201).json({
      status: "success",
      data: {
        collection,
      },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({
        status: "fail",
        message: "Collection with that name already exist",
      });
    }
    next(err);
  }
};

export const getCollectionHandler = async (
  req: Request<GetCollectionInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { select, include } = createObjectFromURLParamsAttributes(
      req.query as GenericObject
    );

    const collection = await getCollection(
      { id: req.params.collectionId },
      select as Prisma.CollectionSelect,
      include as Prisma.CollectionInclude
    );

    if (!collection) {
      return next(new AppError(404, "Collection not found"));
    }

    res.status(200).json({
      status: "success",
      data: {
        collection,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getCollectionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { where, select, include } = createObjectFromURLParamsAttributes(
      req.query as GenericObject
    );

    const collections = await getCollections(
      where as Prisma.CollectionWhereInput,
      select as Prisma.CollectionSelect,
      include as Prisma.CollectionInclude
    );

    if (!collections) {
      return next(new AppError(404, "Collections not found"));
    }

    res.status(200).json({
      status: "success",
      data: {
        collections,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getCollectionsAccountsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { where, select, include } = createObjectFromURLParamsAttributes(
      req.query as GenericObject
    );

    const collectionsAccounts = await getCollectionsAccounts(
      where as Prisma.CollectionAccountWhereInput
    );

    res.status(200).json({
      status: "success",
      data: {
        collectionsAccounts,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const updateCollectionHandler = async (
  req: Request<
    UpdateCollectionInput["params"],
    {},
    UpdateCollectionInput["body"]
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const collection = await getCollection({ id: req.params.collectionId });

    if (!collection) {
      return next(new AppError(404, "Collection not found"));
    }

    const updatedCollection = await updateCollection(
      { id: req.params.collectionId },
      {
        ...req.body,
        members: { connect: res.locals.user.id },
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        updatedCollection,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const deleteCollectionHandler = async (
  req: Request<DeleteCollectionInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const collection = await getCollection({ id: req.params.collectionId });

    if (!collection) {
      return next(new AppError(404, "Collection not found"));
    }

    const deletedCollection = await deleteCollection({
      id: req.params.collectionId,
    });

    res.status(204).json({
      status: "success",
      data: {
        deletedCollection,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const leaveCollectionHandler = async (
  req: Request<DeleteCollectionInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const collectionAccount = await getCollectionAccount({
      collectionId: req.params.collectionId,
      userId: res.locals.user.id,
    });

    if (!collectionAccount) {
      return next(new AppError(404, "Collection account not found"));
    }

    await leaveCollection({ id: collectionAccount.id });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err: any) {
    next(err);
  }
};

export const joinCollectionHandler = async (
  req: Request<DeleteCollectionInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const collectionBody = {
      role: req.body.role,
      user: {
        connect: { id: res.locals.user.id },
      },
      collection: {
        connect: { id: req.params.collectionId },
      },
    };
    const collectionAccount = await joinCollection(collectionBody);

    res.status(201).json({ status: "success", data: { collectionAccount } });
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          status: "fail",
          message: "Account is already a member",
        });
      }
    }
    next(err);
  }
};
