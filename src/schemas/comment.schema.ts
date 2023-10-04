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

export const getCommentsSchema = object({
  ...params,
});

export type CreateCommentInput = TypeOf<typeof createCommentSchema>["body"];
export type GetCommentsInput = TypeOf<typeof getCommentsSchema>["params"];
