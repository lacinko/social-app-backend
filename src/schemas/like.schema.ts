import { TypeOf, boolean, object, string } from "zod";

export const createLikeSchema = object({
  body: object({
    postId: string({
      invalid_type_error: "postId must be string",
    }).optional(),
    commentId: string({
      invalid_type_error: "commentId must be string",
    }).optional(),
    isPositive: boolean({
      required_error: "isPositive is required",
      invalid_type_error: "isPositive must be boolean",
    }),
  }),
});

export const params = {
  params: object({
    postId: string().optional(),
    commentId: string().optional(),
  }),
};

export const getLikeSchema = object({
  ...params,
});
export const deleteLikeSchema = object({
  ...params,
});

export type CreateLikeInput = TypeOf<typeof createLikeSchema>["body"];
export type GetLikeInput = TypeOf<typeof getLikeSchema>["params"];
export type DeleteLikeInput = TypeOf<typeof deleteLikeSchema>["params"];
