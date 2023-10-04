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
  getCollections,
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
    const collections = await getCollections();

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
