import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("No JWT_KEY provided!");
  }
  if(!process.env.MONGO_URI){
    throw new Error("No MONGO_URI provided!");
  }
  await mongoose.connect(process.env.MONGO_URI, (err) => {
    if (!!err) {
      console.log(err.message);
    } else {
      console.log("Tickets service connected to mongodb");
      app.listen(3000, () => {
        console.log("Tickets service is up on port 3000");
      });
    }
  });
};
start();
