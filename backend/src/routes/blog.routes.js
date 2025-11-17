// src/routes/blog.routes.js
import express from "express";
import * as BlogCtrl from "../controllers/blog.controller.js";
import { isAuth } from "../middleware/auth.js"; // dùng middleware auth hiện có của bạn
import { isAuthorOrAdmin } from "../middleware/permissions.js";
import { createPostValidator, updatePostValidator, getPostsValidator } from "../validators/blog.validator.js";
import Post from "../models/Post.js";

const router = express.Router();

/**
 * Public
 */
router.get("/categories", BlogCtrl.listCategories);
router.get("/posts", getPostsValidator, BlogCtrl.getPosts);
router.get("/posts/:idOrSlug", BlogCtrl.getPost);

/**
 * Protected routes (require login)
 */
router.post("/categories", isAuth, BlogCtrl.createCategory);
router.post("/posts", isAuth, createPostValidator, BlogCtrl.createPost);

/**
 * Update / delete: only author or admin can do
 * we supply getResourceAuthorId for permission check
 */
router.put("/posts/:id", isAuth, isAuthorOrAdmin(async (req) => {
  const p = await Post.findById(req.params.id).select("author");
  return p ? p.author : null;
}), updatePostValidator, BlogCtrl.updatePost);

router.patch("/posts/:id/publish", isAuth, isAuthorOrAdmin(async (req) => {
  const p = await Post.findById(req.params.id).select("author");
  return p ? p.author : null;
}), BlogCtrl.publishPost);

router.delete("/posts/:id", isAuth, isAuthorOrAdmin(async (req) => {
  const p = await Post.findById(req.params.id).select("author");
  return p ? p.author : null;
}), BlogCtrl.deletePost);

router.get("/me/posts", isAuth, BlogCtrl.getMyPosts);

export default router;
