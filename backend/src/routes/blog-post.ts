import express from "express";
import * as blogPostControllers from "../controllers/blog-post";
import { featuredImageUpload, inPostImageUpload } from "../middlewares/image-upload";
import requiresAuth from "../middlewares/requiresAuth";
import validateRequestSchema from "../middlewares/validateRequestSchema";
import { createBlogPostSchema, deleteBlogPostSchema, getBlogPostsSchema, updateBlogPostSchema, uploadInPostImageSchema } from "../validation/blog-post";
import { createPostRateLimit, updatePostRateLimit, uploadImageRateLimit } from "../middlewares/rate-limit";
import { createCommentSchema, deleteCommentSchema, getCommentRepliesSchema, getCommentSchema, updateCommentSchema } from "../validation/comment";

const router = express.Router();

router.get ("/slugs", blogPostControllers.getAllBlogPostSlugs);

router.get("/", validateRequestSchema(getBlogPostsSchema), blogPostControllers.getAllBlogPosts);

router.get("/post/:slug", blogPostControllers.getBlogPostBySlug);

router.post("/", requiresAuth, createPostRateLimit, featuredImageUpload.single("featuredImage"), validateRequestSchema(createBlogPostSchema),  blogPostControllers.createBlogPost);

router.patch("/:blogPostId", requiresAuth, updatePostRateLimit,  featuredImageUpload.single("featuredImage"), validateRequestSchema(updateBlogPostSchema), blogPostControllers.updateBlogPost);

router.delete("/:blogPostId", requiresAuth,  validateRequestSchema(deleteBlogPostSchema), blogPostControllers.deleteBlogPost);

router.post("/images", requiresAuth, uploadImageRateLimit, inPostImageUpload.single("inPostImage"), validateRequestSchema(uploadInPostImageSchema), blogPostControllers.uploadInPostImage);

router.get("/:blogPostId/comments", validateRequestSchema(getCommentSchema), blogPostControllers.getCommentsForBlogPost);

router.post("/:blogPostId/comments", requiresAuth, validateRequestSchema(createCommentSchema), blogPostControllers.createComment);

router.get("/comments/:commentId/replies", validateRequestSchema(getCommentRepliesSchema), blogPostControllers.getCommentReplies);

router.patch("/comments/:commentId", requiresAuth, validateRequestSchema(updateCommentSchema), blogPostControllers.updateComment);

router.delete("/comments/:commentId", requiresAuth, validateRequestSchema(deleteCommentSchema), blogPostControllers.deleteComment);

export default router;