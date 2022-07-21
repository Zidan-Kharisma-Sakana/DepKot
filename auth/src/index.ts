import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("No JWT KEY");
  }
  await mongoose.connect("mongodb://auth-mongo-service:27017/auth", (err) => {
    if (!!err) {
      console.log(err.message);
    } else {
      console.log("Auth service connected to mongodb");
      app.listen(3000, () => {
        console.log("Auth service is up on port 3000 aa");
      });
    }
  });
};
start();
