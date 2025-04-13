import { SessionOptions } from "express-session";
import env from "../env";
import RedisStore from "connect-redis";
import MongoStore from "connect-mongo";
import crypto from "crypto";
import redisClient from "./redisClient";

const store = env.NODE_ENV === "production"
? new RedisStore({
    client: redisClient,
})
: MongoStore.create({
    mongoUrl: env.MONGO_CONNECTION_STRING
})

const sessionConfig: SessionOptions = {
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:  {
        maxAge: 7 * 24 * 60 * 60 * 1000,
     sameSite: env.NODE_ENV === "production" ? "none" : "lax",
     secure: env.NODE_ENV === "production"
    },
    rolling: true,
    store: store,

    genid(req) {
        const userId = req.user?._id;
        const randomId = crypto.randomUUID();

        if(userId){
            return `${userId}-${randomId}`
        }else {
            return randomId
        }
    },
}

export default sessionConfig;