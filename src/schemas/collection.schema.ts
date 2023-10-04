import {
  TypeOf,
  array,
  boolean,
  literal,
  nativeEnum,
  object,
  string,
  union,
} from "zod";

export const createCollectionSchema = object({
  body: object({
    name: string({
      required_error: "Title is required",
    }).min(3, "Collection name must be longer than 3 characters"),
    type: union([literal("PUBLIC"), literal("RESTRICTED"), literal("PRIVATE")]),
    nsfw: boolean(),
    accountRole: union([
      literal("ADMIN"),
      literal("MODERATOR"),
      literal("MEMBER"),
    ]),
  }),
});

const params = {
  params: object({
    collectionId: string(),
  }),
};

export const getCollectionSchema = object({
  ...params,
});

export const updateCollectionSchema = object({
  ...params,
  body: object({
    name: string(),
    members: array(
      object({
        id: string().uuid(),
      })
    ),
  }),
});

export const deleteCollectionSchema = object({
  ...params,
});

export type CreateCollectionInput = TypeOf<
  typeof createCollectionSchema
>["body"];
export type UpdateCollectionInput = TypeOf<typeof updateCollectionSchema>;
export type GetCollectionInput = TypeOf<typeof getCollectionSchema>["params"];
export type DeleteCollectionInput = TypeOf<
  typeof deleteCollectionSchema
>["params"];
