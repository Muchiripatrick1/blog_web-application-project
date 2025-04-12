import mongoose from "mongoose";
import app from "./app";
import env from "./env";

const PORT = process.env.PORT || 5000;

mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(()=>{
    console.log("mongoose connected")
    app.listen(PORT, ()=> console.log("server running on port"+ PORT));
})
.catch(
    console.error
);