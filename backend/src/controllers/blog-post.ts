import { RequestHandler } from "express";
import blogPostModels from "../models/blog-post";
import CommentModel from "../models/comment";
import assertIsDefined from "../utils/assertIsDefined";
import mongoose from "mongoose";
import sharp from "sharp";
import env from "../env";
import createHttpError from "http-errors";
import { createBlogPostValues, DeleteBlogPostParams, GetBlogPostsQuery, UpdateBlogPostParams } from "../validation/blog-post";
import fs from "fs";
import { CreateCommentBody, CreateCommentParams, DeleteCommentParams, GetCommentRepliesParams, GetCommentRepliesQuery, GetCommentsParams, GetCommentsQuery, UpdateCommentBody, UpdateCommentParams } from "../validation/comment";
import crypto from "crypto";
import path from "path";


export const getAllBlogPosts: RequestHandler<unknown, unknown, unknown, GetBlogPostsQuery> = async(req, res, next) =>{

    const authorId = req.query.authorId;

    const page = parseInt (req.query.page || "1");

    const pageSize = 6;

    const filter = authorId ? { author: authorId} : { };
    try {
        const getBlogPostsQuery =  blogPostModels
        .find(filter)
        .sort({_id: -1})
        .skip((page-1) * pageSize)
        .limit(pageSize)
        .populate("author")
        .exec();

       const countDocumentsQuery = await blogPostModels.countDocuments(filter).exec();

       const [blogPosts, totalResult] = await Promise.all([getBlogPostsQuery, countDocumentsQuery]);

       const totalPages = Math.ceil(totalResult / pageSize);

        res.status(200).json({
            blogPosts,
            page,
            totalPages,
        });
    } catch (error) {
        next(error);
    }
};


export const getAllBlogPostSlugs: RequestHandler = async (req, res, next ) =>{
    try {
        const results = await blogPostModels.find().select("slug").exec();
        const slugs = results.map(post => post.slug );
         res.status(200).json(slugs);

    } catch (error) {
        next(error);
      
    }
}


export const getBlogPostBySlug: RequestHandler = async (req, res, next) => {
    try {
        const blogPost = await blogPostModels
        .findOne({slug: req.params.slug})
        .populate("author")
        .exec()

        if(!blogPost){
        throw createHttpError(404, "No blog post found for this slug");
        }

        if (!blogPost.author) {
            throw createHttpError(500, "Author information is missing for this blog post");
        }

          res.status(200).json(blogPost)
    } catch (error) {
        next(error);
       
    }
}


export const createBlogPost: RequestHandler<unknown, unknown, createBlogPostValues, unknown> = async(req, res, next) => {

    const {slug, title, summary, body} = req.body;
    const featuredImage=req.file;
    const authenticatedUser = req.user;


    try {
        assertIsDefined(featuredImage);
        assertIsDefined(authenticatedUser);

        const existingSlug = await blogPostModels.findOne({slug}).exec();

        if(existingSlug){
            throw createHttpError(409, "Slug already taken. Please choose another one.")
        }

        const blogPostId = new mongoose.Types.ObjectId();

        //const featuredImageDestinationPath = "/uploads/featured-images/" + blogPostId + ".png";
        const featuredImageDestinationPath = path.join(__dirname, "..", "uploads", "featured-images", `${blogPostId}.png`);


        
        // Ensure the directory exists before saving the image
        const uploadDir = path.join(__dirname, "..", "uploads", "featured-images");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        await sharp(featuredImage.buffer)
        .resize(700, 450)
        .toFile("./" + featuredImageDestinationPath);

        const newPost = await blogPostModels.create({
            _id: blogPostId,
            slug,
            title,
            summary,
            body,
            featuredImageUrl: env.SERVER_URL + featuredImageDestinationPath,
            author: authenticatedUser._id,
            });

        res.status(201).json(newPost)

    } catch (error) {
        next(error);
    }
};


export const updateBlogPost: RequestHandler<UpdateBlogPostParams, unknown, createBlogPostValues, unknown> = async (req, res, next) => {

    const { blogPostId } = req.params;
    const { title, slug, summary, body } = req.body;
    const featuredImage = req.file;
    const authenticatedUser = req.user;

    try {

        assertIsDefined(authenticatedUser);

        const existingSlug = await blogPostModels.findOne({ slug }).exec();

        if(existingSlug && !existingSlug._id.equals(blogPostId)){
            throw createHttpError(409, "Slug already taken. Please choose another one.");
        }
        const postToEdit = await blogPostModels.findById(blogPostId).exec();

        if(!postToEdit){
            throw createHttpError(404);
        }

        if(!postToEdit.author.equals(authenticatedUser._id)){
            throw createHttpError(401);
        }

        postToEdit.slug = slug;
        postToEdit.title = title;
        postToEdit.summary = summary;
        postToEdit.body = body;

        if(featuredImage){
            //const featuredImageDestinationPath = "/uploads/featured-images/" + blogPostId + ".png";
            const featuredImageDestinationPath = path.join(__dirname, "..", "uploads", "featured-images", `${blogPostId}.png`);


            // Ensure the directory exists before saving the image
            const uploadDir = path.join(__dirname, "..", "uploads", "featured-images");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            await sharp(featuredImage.buffer)
            .resize(700, 450)
            .toFile("./" + featuredImageDestinationPath);

            postToEdit.featuredImageUrl = env.SERVER_URL + featuredImageDestinationPath + "?lastupdated=" + Date.now();
        }

        await postToEdit.save();

        res.sendStatus(200);

    } catch (error) {
        next(error);
    }
}

export const deleteBlogPost: RequestHandler<DeleteBlogPostParams, unknown, unknown, unknown> = async (req, res, next) => {

    const { blogPostId } = req.params;
    const authenticatedUser = req.user;

    try {
        
        assertIsDefined(authenticatedUser);

        const postToDelete = await blogPostModels.findById(blogPostId).exec();

        if(!postToDelete){
            throw createHttpError(404);
        }

        if(!postToDelete.author.equals(authenticatedUser._id)){
            throw createHttpError(401);
        }

        if(postToDelete.featuredImageUrl.startsWith(env.SERVER_URL)){
            const imagePath = postToDelete.featuredImageUrl.split(env.SERVER_URL)[1].split("?")[0];

            fs.unlinkSync("." + imagePath);
        }

        await postToDelete.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}


export const uploadInPostImage: RequestHandler = async(req, res, next) => {

    const image = req.file;

    try {
       assertIsDefined(image); 

       const fileName = crypto.randomBytes(20).toString("hex");

       //const imageDestinationPath = "/uploads/in-post-images/" + fileName + path.extname(image.originalname);
       const imageDestinationPath = "/uploads/in-post-images/" + fileName + path.extname(image.originalname);



       // Ensure the directory exists before saving the image
       const uploadDir = path.join(__dirname, "..", "uploads", "in-post-images");
       if (!fs.existsSync(uploadDir)) {
           fs.mkdirSync(uploadDir, { recursive: true });
       }

       await sharp(image.buffer)
       .resize(1920, undefined, {withoutEnlargement: true})
       .toFile("./" + imageDestinationPath);

       res.status(201).json({ imageUrl: env.SERVER_URL + imageDestinationPath});
    } catch (error) {
        next(error);
    }
}


export const getCommentsForBlogPost: RequestHandler<GetCommentsParams, unknown, unknown, GetCommentsQuery> = async (req, res, next) => {

    const { blogPostId } = req.params;
    const { continueAfterId } = req.query;

    const pageSize = 3;

    try {
        const query = CommentModel
        .find({ blogPostId, parentCommentId: undefined })
        .sort({ _id: -1})

        if(continueAfterId){
            query.lt("_id", continueAfterId)
        }

        const result = await query
        .limit(pageSize + 1)
        .populate("author")
        .exec();

        const comments = result.slice(0, pageSize);
        const endOfPaginationReached = result.length <= pageSize;

        const commentsWithRepliesCount = await Promise.all (comments.map( async comment => {
            const repliesCount = await CommentModel.countDocuments({ parentCommentId: comment._id});
            return {...comment.toObject(), repliesCount}
        }));

        res.status(200).json({
            comments: commentsWithRepliesCount,
            endOfPaginationReached,
        })
    } catch (error) {
        next(error);
    }
}


export const getCommentReplies: RequestHandler<GetCommentRepliesParams, unknown, unknown, GetCommentRepliesQuery> = async (req, res, next) => {

    const { commentId: parentCommentId} = req.params;
    const { continueAfterId } = req.query;

    const pageSize = 2;

    try {
       const query = CommentModel.find({ parentCommentId});

       if(continueAfterId){
        query.gt("_id", continueAfterId);
       }

       const result = await query
       .limit(pageSize + 1)
       .populate("author")
       .exec();

       const comments = result.slice(0, pageSize);
       const endOfPaginationReached = result.length <= pageSize;

       res.status(200).json({
        comments,
        endOfPaginationReached,
       });

    } catch (error) {
        next(error);
    }
}


export const createComment: RequestHandler<CreateCommentParams, unknown, CreateCommentBody, unknown> = async(req, res, next) => {

    const { blogPostId } = req.params;
    const { text, parentCommentId } =req.body;
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);

        const newComment = await CommentModel.create({
            blogPostId,
            text,
            author: authenticatedUser,
            parentCommentId,
        });

        await CommentModel.populate(newComment, { path: "author"});

        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
}


export const updateComment: RequestHandler<UpdateCommentParams, unknown, UpdateCommentBody, unknown> = async (req, res,next) => {

    const {commentId} = req.params;
    const { newText} = req.body;
    const authenticatedUser = req.user;

    try {
        assertIsDefined(authenticatedUser);

        const commentToUpdate = await CommentModel
        .findById(commentId)
        .populate("author")
        .exec();

        if(!commentToUpdate){
            throw createHttpError(404);
        }

        if(!commentToUpdate.author.equals(authenticatedUser._id)){
            throw createHttpError(401);
        }

        commentToUpdate.text = newText;
        await commentToUpdate.save();

        res.status(200).json(commentToUpdate);
    } catch (error) {
       next(error); 
    }
}


export const deleteComment: RequestHandler<DeleteCommentParams, unknown, unknown, unknown> = async (req, res, next) => {

    const { commentId } = req.params;
    const authenticatedUser = req.user;
    try {
        assertIsDefined(authenticatedUser);

        const commentToDelete = await CommentModel.findById(commentId).exec();

        if(!commentToDelete){
            throw createHttpError(404);
        }

        if(!commentToDelete.author.equals(authenticatedUser._id)){
            throw createHttpError(401);
        }

        await commentToDelete.deleteOne();

        await CommentModel.deleteMany({parentCommentId: commentId}).exec();

        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}
