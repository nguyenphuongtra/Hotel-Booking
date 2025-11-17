// src/validators/blog.validator.js
import { body, param, query } from "express-validator";

export const createPostValidator = [
  body("title").isString().isLength({ min: 3 }).withMessage("Title tối thiểu 3 ký tự"),
  body("content").isString().isLength({ min: 10 }).withMessage("Content tối thiểu 10 ký tự"),
  body("excerpt").optional().isString(),
  body("category").optional().isMongoId(),
  body("tags").optional().isArray(),
  body("status").optional().isIn(["draft", "published"]),
];

export const updatePostValidator = [
  body("title").optional().isString().isLength({ min: 3 }),
  body("content").optional().isString().isLength({ min: 10 }),
  body("excerpt").optional().isString(),
  body("category").optional().isMongoId(),
  body("tags").optional().isArray(),
  body("status").optional().isIn(["draft", "published"]),
];

export const getPostsValidator = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("status").optional().isIn(["draft", "published"]),
  query("category").optional().isString(),
  query("search").optional().isString(),
];
