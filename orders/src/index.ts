import mongoose from "mongoose";
import { natsWrapper } from "./nats";

import { app } from "./app";
import { StoreCreatedListener } from "./events/listener/store-created";
import { StoreUpdatedListener } from "./events/listener/store-updated";
import { ProductCreatedListener } from "./events/listener/product-created";
import { ProductUpdatedListener } from "./events/listener/product-updated";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("No JWT_KEY provided!");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("No MONGO_URI provided!");
  }
  if (
    !process.env.NATS_URL ||
    !process.env.NATS_CLUSTER_ID ||
    !process.env.NATS_CLIENT_ID
  ) {
    throw new Error("NATS Variable isn't complete!");
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new StoreCreatedListener(natsWrapper.client).listen();
    new StoreUpdatedListener(natsWrapper.client).listen();
    new ProductCreatedListener(natsWrapper.client).listen();
    new ProductUpdatedListener(natsWrapper.client).listen();
    
  } catch (err) {
    console.error(err);
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
