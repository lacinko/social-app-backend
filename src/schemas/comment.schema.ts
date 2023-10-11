import { object, string, TypeOf } from "zod";

export const createCommentSchema = object({
  body: object({
    content: string({
      required_error: "Comment can't be empty",
    }),
  }),
});

const params = {
  params: object({
    postId: string(),
  }),
};

const paramsWithCommentId = {
  params: object({
    commentId: string(),
  }),
};

export const getCommentsSchema = object({
  ...params,
});

export const deleteCommentSchema = object({
  ...paramsWithCommentId,
});

export const updateCommentSchema = object({
  ...paramsWithCommentId,
  body: object({
    content: string({
      required_error: "Comment can't be empty",
    }),
  }),
});

export type CreateCommentInput = TypeOf<typeof createCommentSchema>["body"];
export type GetCommentsInput = TypeOf<typeof getCommentsSchema>["params"];
export type DeleteCommentInput = TypeOf<typeof deleteCommentSchema>["params"];
export type UpdateCommentInput = TypeOf<typeof updateCommentSchema>;
