import mongoose from "mongoose";
import app from "./app";
import env from "./env";

 const port = Number(process.env.PORT || 8080);



mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(()=>{
    console.log("mongoose connected")
    app.listen(port, '0.0.0.0', () => {
        console.log("server running on port " + port);
      });
})
.catch(
    console.error
);

