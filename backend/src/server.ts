import mongoose from "mongoose";
import app from "./app";
import env from "./env";

const PORT = Number(process.env.PORT) || 10000;

const HOST = '0.0.0.0'

mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(()=>{
    console.log("mongoose connected")
    app.listen(PORT, HOST,()=> console.log("server running on port"+ PORT));
})
.catch(
    console.error
);